import pool from '../db/db.js';

// GET all books
export async function getBooks(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        b.id,
        b.title,
        b.original_title,
        b.series_order,
        b.status,
        b.date_started,
        b.date_finished,
        b.date_unknown,
        b.rating,
        b.format,
        b.genre,
        b.location,
        b.publication_year,
        b.notes,

        a.name AS author_name,
        s.name AS series_name

      FROM books b
      JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN series s ON b.series_id = s.series_id
      ORDER BY b.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("DB ERROR:", error); 
    res.status(500).json({ message: "Error fetching books" });
  }
};

// SEARCH books
export const searchBooks = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    // búsqueda normal (LA TUYA, intacta)
    const searchQuery = `
      SELECT
        b.*,
        a.name AS author_name,
        s.name AS series_name
      FROM books b
      JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN series s ON b.series_id = s.series_id
      WHERE
        b.title ILIKE '%' || $1 || '%'
        OR b.original_title ILIKE '%' || $1 || '%'
        OR a.name ILIKE '%' || $1 || '%'
        OR s.name ILIKE '%' || $1 || '%'
      ORDER BY b.title;
    `;

    const result = await pool.query(searchQuery, [q]);

    // Sí hay resultados
    if (result.rows.length > 0) {
      return res.json({
        results: result.rows
      });
    }

    // No hay resultados, buscamos sugerencia
    const suggestionQuery = `
      SELECT
        b.title
      FROM books b
      ORDER BY GREATEST(
        similarity(b.title, $1),
        similarity(b.original_title, $1)
      ) DESC
      LIMIT 1;
    `;

    const suggestionResult = await pool.query(suggestionQuery, [q]);

    return res.json({
      results: [],
      didYouMean: suggestionResult.rows[0]?.title || null
    });

  } catch (error) {
    console.error("SEARCH BOOKS ERROR:", error);
    res.status(500).json({ message: "Error searching books" });
  }
};



// GET book by ID 
export async function fetchBookById (req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    
    console.log("Resultado SQL:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    res.status(500).json({ message: "Error fetching book" });
  }
};


async function findOrCreateAuthor(authorName) {
  const searchQuery = "SELECT author_id FROM authors WHERE name = $1 LIMIT 1";
  const result = await pool.query(searchQuery, [authorName]);

  if (result.rows.length > 0) {
    return result.rows[0].author_id;
  }

  const insertQuery =
    "INSERT INTO authors (name) VALUES ($1) RETURNING author_id";
  const insertResult = await pool.query(insertQuery, [authorName]);

  return insertResult.rows[0].author_id; 
}


async function findOrCreateSeries(seriesName) {
  const searchQuery = "SELECT series_id FROM series WHERE name = $1 LIMIT 1";
  const result = await pool.query(searchQuery, [seriesName]);

  if (result.rows.length > 0) {
    return result.rows[0].series_id;
  }

  const insertQuery =
    "INSERT INTO series (name) VALUES ($1) RETURNING series_id";
  const insertResult = await pool.query(insertQuery, [seriesName]);

  return insertResult.rows[0].series_id; 
}


// CREATE book
export async function createBook (req, res) {
  try {
  const { title, author, format, status, genre, series = null } = req.body;

  const author_id = await findOrCreateAuthor(author);

  let series_id = null;
  if (series) {  
    series_id = await findOrCreateSeries(series);
  }
  const query = `
      INSERT INTO books (title, author_id, format, status, series_id, genre) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `;
      const values = [title, author_id, format, status, series_id, genre ];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
  
  } catch (error) {
    console.error("Error creating book", error);
    res.status(500).json({ message: "Error creating book" });
  }
};


// UPDATE book
export const updateBook = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    original_title,
    author,      
    series, 
    series_order,
    date_started,
    date_finished,
    date_unknown,
    rating,   
    genre,
    status,
    format,
    location,
    publication_year
  } = req.body;

  try {
    // comprobar existencia del libro
    const existingBookResult = await pool.query(
      "SELECT * FROM books WHERE id = $1",
      [id]
    );

    if (existingBookResult.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    // buscar/crear autor
    let author_id = null;
    if (typeof author !== "undefined" && author !== null && author !== "") {
      const authorRes = await pool.query(
        "SELECT author_id FROM authors WHERE name = $1 LIMIT 1",
        [author]
      );
      if (authorRes.rows.length > 0) {
        author_id = authorRes.rows[0].author_id;
      } else {
        const insertAuthor = await pool.query(
          "INSERT INTO authors (name) VALUES ($1) RETURNING author_id",
          [author]
        );
        author_id = insertAuthor.rows[0].author_id;
      }
    }

    // buscar/crear series
    let series_id = null;
    if (typeof series !== "undefined" && series !== null && series !== "") {
      const seriesRes = await pool.query(
        "SELECT series_id FROM series WHERE name = $1 LIMIT 1",
        [series]
      );
      if (seriesRes.rows.length > 0) {
        series_id = seriesRes.rows[0].series_id;
      } else {
        const insertSeries = await pool.query(
          "INSERT INTO series (name) VALUES ($1) RETURNING series_id",
          [series]
        );
        series_id = insertSeries.rows[0].id;
      }
    }

    // actualizar 
    const updateQuery = `
      UPDATE books SET
        title = COALESCE($1, title),
        original_title = COALESCE ($2, original_title),
        author_id = COALESCE($3, author_id),
        series_id = COALESCE($4, series_id),
        series_order = COALESCE ($5, series_order),
        date_started = COALESCE ($6, date_started),
        date_finished = COALESCE ($7, date_finished),
        date_unknown = COALESCE ($8, date_unknown),
        rating = COALESCE ($9, rating),
        genre = COALESCE($10, genre),
        status = COALESCE($11, status),
        format = COALESCE($12, format),
        location = COALESCE($13, location),
        publication_year = COALESCE ($14, publication_year)
      WHERE id = $15
      RETURNING *;
    `;

    const values = [
  title ?? null,
  original_title ?? null,
  author_id,       
  series_id,        
  series_order ?? null,
  date_started ?? null,
  date_finished ?? null,
  date_unknown ?? null,
  rating ?? null,
  genre ?? null,
  status ?? null,
  format ?? null,
  location ?? null,
  publication_year ?? null,
  id
];

    const updateResult = await pool.query(updateQuery, values);

    res.json({
      message: "Book updated successfully",
      book: updateResult.rows[0]
    });
  } catch (error) {
  console.error("UPDATE BOOK ERROR:", error);
  res.status(500).json({
    message: "Error updating book",
    error: error.message,
  });
}
};


// DELETE book
export const deleteBook = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1", [id]);

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Error deleting book" });
  }
};