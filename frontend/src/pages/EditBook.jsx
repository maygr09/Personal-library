import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import BookForm from "../components/bookForm";
import { getBookById, updateBook } from "../services/books";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookById(id).then((data) => {
      setBook(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading…</p>;

  const handleUpdate = async (payload) => {
    try {
      await updateBook(id, payload);
      navigate("/");
    } catch {
      alert("Error updating book");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/" className="text-purple-600 hover:underline">
        ← Back to library
      </Link>

      <h1 className="text-3xl font-bold my-6">Edit Book</h1>

     <BookForm
  initialData={{
    title: book.title ?? "",
    original_title: book.original_title ?? "",
    author: book.author_name ?? "",
    series: book.series_name ?? "",
    series_order: book.series_order ?? "",
    status: book.status ?? "Pendiente",
    date_started: book.date_started ?? "",
    date_finished: book.date_finished ?? "",
    date_unknown: book.date_unknown ?? false,
    rating: book.rating ?? "",
    format: book.format ?? "",
    genre: book.genre ?? "",
    location: book.location ?? "",
    publication_year: book.publication_year ?? "",
    notes: book.notes ?? "",
  }}
  onSubmit={handleUpdate}
  submitLabel="Update book"
/>
    </div>
  );
}