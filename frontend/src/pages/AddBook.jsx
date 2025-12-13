import { Link } from "react-router-dom";
import { useState } from "react";
import { createBook } from "../services/books";
import { useNavigate } from "react-router-dom";

export default function AddBook() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    original_title: "",
    author: "",
    series: "",
    series_order: "",
    status: "Pendiente",
    date_started: "",
    date_finished: "",
    date_unknown: false,
    rating: "",
    format: "",
    genre: "",
    location: "",
    publication_year: "",
    notes: "",
  });

  const FORMATS = [
  "ePub",
  "Físico",
];

const GENRES = [
  "Histórico Inglaterra",
  "Escocés histórico",
  "Escocés moderno",
  "Nórdico romántico",
  "Romance",
  "Juvenil romántico",
  "Fantasía/Magia",
  "Autoconocimiento",
  "Suspenso",
  "Terror",
  "Ciencia ficción",
  "Música",
  "Matemáticas",
  "Idiomas",
];

const LOCATIONS = [
  "iPhone/Books",
  "iPhone/Files",
  "Portatil",
  "Físico/Twilight",
  "Físico/Outlander",
  "Físico/Languages",
  "Físico/Música",
  "Físico/Varios",
  "No disponible",
];


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      series: formData.series || null,
      series_order: formData.series ? formData.series_order || null : null,
      date_started:
        formData.status === "Leido" && !formData.date_unknown
          ? formData.date_started || null
          : null,
      date_finished:
        formData.status === "Leido" && !formData.date_unknown
          ? formData.date_finished || null
          : null,
    };

    try {
      await createBook(payload);
      navigate("/");
    } catch (err) {
      alert("Error creating book");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
        <Link
  to="/"
  className="inline-block mb-4 text-purple-600 hover:underline"
>
  ← Back to library
</Link>
      <h1 className="text-3xl font-bold mb-6">Add Book</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="author"
          placeholder="Author"
          required
          value={formData.author}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="original_title"
          placeholder="Original title"
          value={formData.original_title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Leido">Leido</option>
        </select>

        <input
          name="series"
          placeholder="Series (optional)"
          value={formData.series}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {formData.series && (
          <input
            name="series_order"
            placeholder="Series order"
            value={formData.series_order}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        )}

        {formData.status === "Leido" && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="date_unknown"
              checked={formData.date_unknown}
              onChange={handleChange}
            />
            Reading dates unknown
          </label>
        )}

        {formData.status === "Leido" && !formData.date_unknown && (
          <>
            <input
              type="date"
              name="date_started"
              value={formData.date_started}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="date"
              name="date_finished"
              value={formData.date_finished}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </>
        )}

       <select
  name="format"
  value={formData.format}
  onChange={handleChange}
  className="w-full border p-2 rounded"
>
  <option value="">Select format</option>
  {FORMATS.map((f) => (
    <option key={f} value={f}>
      {f}
    </option>
  ))}
</select>


       <select
  name="genre"
  value={formData.genre}
  onChange={handleChange}
  className="w-full border p-2 rounded"
>
  <option value="">Select genre</option>
  {GENRES.map((g) => (
    <option key={g} value={g}>
      {g}
    </option>
  ))}
</select>

      <select
  name="location"
  value={formData.location}
  onChange={handleChange}
  className="w-full border p-2 rounded"
>
  <option value="">Select location</option>
  {LOCATIONS.map((l) => (
    <option key={l} value={l}>
      {l}
    </option>
  ))}
</select>

        <input
          type="number"
          name="publication_year"
          placeholder="Publication year"
          value={formData.publication_year}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button className="bg-purple-600 text-white px-4 py-2 rounded">
          Save book
        </button>
      </form>
    </div>
  );
}