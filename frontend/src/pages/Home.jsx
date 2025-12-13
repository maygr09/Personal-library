import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../services/books";
import BookCard from "../components/BookCard";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBooks()
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading books…</p>;
  }
  if (error) {
    return (
    <p className="text-center mt-10 text-red-600">
        Error: {error}
        </p>
    );
}

  return (
    <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
      <div className="flex items-center justify-between mb-6">
      <h1 className="text-4xl font-bold">
          My Personal Library
        </h1>

 <Link
          to="/add"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Add Book
        </Link>
      </div>

      {/* Books grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {books.map((book) => (
    <BookCard key={book.id} book={book} />
  ))}
</div>
</div>
  );
}