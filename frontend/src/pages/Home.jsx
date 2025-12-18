import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../services/books";
import BookCard from "../components/BookCard";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [searching, setSearching] = useState(false);


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

  useEffect(() => {
  // Si el input queda vacío, volvemos a cargar todos los libros
  if (query === "") {
    setLoading(true);
    setSuggestion(null);

    getBooks()
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }
}, [query]);


const handleSearch = async (e) => {
  e.preventDefault();
  if (!query.trim()) return;

  setSearching(true);
  setSuggestion(null);
  setError(null);

  try {
    const res = await fetch(
      `http://localhost:3000/api/books/search?q=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    setBooks(data.results || []);
    setSuggestion(data.didYouMean || null);
  } catch (err) {
    setError("Error searching books");
  } finally {
    setSearching(false);
  }
};


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
       
        {/* Search bar */}
<form onSubmit={handleSearch} className="mb-6">
  <input
    type="text"
    placeholder="Search books…"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-purple-500"
  />
</form>

{/* Did you mean */}
{!searching && books.length === 0 && suggestion && (
  <p className="mb-4 text-gray-600">
    Did you mean{" "}
    <span
      className="text-purple-600 font-semibold cursor-pointer hover:underline"
      onClick={() => {
        setQuery(suggestion);
        setTimeout(() => {
          document.querySelector("form").requestSubmit();
        }, 0);
      }}
    >
      {suggestion}
    </span>
    ?
  </p>
)}

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
{!searching && books.length === 0 && !suggestion && (
  <p className="text-gray-500">No books found.</p>
)}
      {/* Books grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {books.map((book) => (
    <BookCard key={book.id} book={book} />
  ))}
</div>
</div>
  );
}