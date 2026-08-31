// Rebuilds authors / series / books from the CSV export.
// Usage: DATABASE_URL=postgres://... node backend/scripts/seedFromCsv.js path/to/csv
import fs from "fs";
import path from "path";
import pg from "pg";

const { Pool } = pg;

const csvPath = process.argv[2] || path.resolve(process.cwd(), "csv/Libros-Libros.csv");
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing DATABASE_URL env var.");
  process.exit(1);
}

// Minimal RFC4180-ish CSV parser (handles quoted fields, embedded commas, "" escapes)
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\r") {
        // skip
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += c;
      }
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function toNullable(v) {
  if (v === undefined) return null;
  const t = v.trim();
  return t === "" ? null : t;
}

function toBool(v) {
  const t = toNullable(v);
  if (t === null) return false;
  return t.toUpperCase() === "TRUE";
}

function toInt(v) {
  const t = toNullable(v);
  if (t === null) return null;
  const n = parseInt(t, 10);
  return Number.isNaN(n) ? null : n;
}

function toNumeric(v) {
  const t = toNullable(v);
  if (t === null) return null;
  const n = parseFloat(t);
  return Number.isNaN(n) ? null : n;
}

// CSV dates look like "8 Aug 2023" — convert to ISO or null
function toDate(v) {
  const t = toNullable(v);
  if (t === null) return null;
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

async function main() {
  const raw = fs.readFileSync(csvPath, "utf8");
  const rows = parseCsv(raw).filter((r) => r.length > 1);
  const header = rows[0].map((h) => h.trim());
  const dataRows = rows.slice(1);

  const idx = (name) => header.indexOf(name);

  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log(`Parsed ${dataRows.length} rows from ${csvPath}`);

    const authorCache = new Map();
    const seriesCache = new Map();

    async function getAuthorId(name) {
      if (!name) return null;
      if (authorCache.has(name)) return authorCache.get(name);
      const found = await client.query("SELECT author_id FROM authors WHERE name = $1", [name]);
      let id;
      if (found.rows.length) {
        id = found.rows[0].author_id;
      } else {
        const inserted = await client.query(
          "INSERT INTO authors (name) VALUES ($1) RETURNING author_id",
          [name]
        );
        id = inserted.rows[0].author_id;
      }
      authorCache.set(name, id);
      return id;
    }

    async function getSeriesId(name) {
      if (!name) return null;
      if (seriesCache.has(name)) return seriesCache.get(name);
      const found = await client.query("SELECT series_id FROM series WHERE name = $1", [name]);
      let id;
      if (found.rows.length) {
        id = found.rows[0].series_id;
      } else {
        const inserted = await client.query(
          "INSERT INTO series (name) VALUES ($1) RETURNING series_id",
          [name]
        );
        id = inserted.rows[0].series_id;
      }
      seriesCache.set(name, id);
      return id;
    }

    let inserted = 0;
    for (const r of dataRows) {
      const csvId = toInt(r[idx("id")]);
      const authorName = toNullable(r[idx("author")]);
      const title = toNullable(r[idx("title")]);
      if (!title) continue; // skip blank rows

      const original_title = toNullable(r[idx("original_title")]);
      const seriesName = toNullable(r[idx("series")]);
      const series_order = toNumeric(r[idx("series_order")]);
      const status = toNullable(r[idx("status")]);
      const date_started = toDate(r[idx("date_started")]);
      const date_finished = toDate(r[idx("date_finished")]);
      const date_unknown = toBool(r[idx("date_unknown")]);
      const rating = toInt(r[idx("rating")]);
      const format = toNullable(r[idx("format")]);
      const genre = toNullable(r[idx("genre")]);
      const location = toNullable(r[idx("location")]);
      const publication_year = toInt(r[idx("publication_year")]);
      const notes = toNullable(r[idx("notes")]);

      const author_id = await getAuthorId(authorName);
      const series_id = await getSeriesId(seriesName);

      await client.query(
        `INSERT INTO books
          (id, title, original_title, author_id, series_id, series_order, status,
           date_started, date_finished, date_unknown, rating, format, genre,
           location, publication_year, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
         ON CONFLICT (id) DO NOTHING`,
        [
          csvId, title, original_title, author_id, series_id, series_order, status,
          date_started, date_finished, date_unknown, rating, format, genre,
          location, publication_year, notes,
        ]
      );
      inserted++;
    }

    // keep the books_id_seq ahead of the highest imported id
    await client.query(
      "SELECT setval(pg_get_serial_sequence('books','id'), COALESCE((SELECT MAX(id) FROM books), 1))"
    );

    await client.query("COMMIT");
    console.log(`Done. Inserted/verified ${inserted} books, ${authorCache.size} authors, ${seriesCache.size} series.`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed failed, rolled back:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
