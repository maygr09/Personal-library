import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks } from "../services/books";
import BookCard from "../components/BookCard";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const totalBooks = allBooks.length;
  const readCount = allBooks.filter(b => b.status === "Leído").length;
  const pendingCount = allBooks.filter(b => b.status === "Pendiente").length;
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [searching, setSearching] = useState(false);
  const [goal, setGoal] = useState("");

  const currentYear = new Date().getFullYear();

  const booksReadThisYear = allBooks.filter(book => {
    return (
      book.status === "Leído" &&
      book.date_finished &&
      new Date(book.date_finished).getFullYear() === currentYear
    );
  }).length;

  const progress = Math.min((booksReadThisYear / goal) * 100, 100);

  useEffect(() => {
    const filters = {};

      if (filter !== "all") {
        filters.status = filter;
      }
      if (sortBy) {
        filters.sort = sortBy;
      }
      
    getBooks(filters)
      .then((data) => {
        setBooks(data);
        setAllBooks(data);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [filter, sortBy]);

  useEffect(() => {
  if (filter === "Leído" && !sortBy) {
    setSortBy("date_finished");
  }
  }, [filter]);

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

useEffect(() => {
  const savedGoal = localStorage.getItem("readingGoal");
  if (savedGoal) setGoal(Number(savedGoal));
}, []);

useEffect(() => {
  localStorage.setItem("readingGoal", goal);
}, [goal]);


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

<div className="mb-6">
  <h2 className="text-lg font-semibold mb-2">
    📖 Reading Goal {currentYear}
  </h2>

  <div className="w-full bg-gray-200 rounded-full h-4">
    <div
      className="bg-purple-600 h-4 rounded-full transition-all"
      style={{ width: `${progress}%` }}
    ></div>
  </div>

  <p className="text-sm mt-2 text-gray-600">
    {booksReadThisYear} / {goal} books read
  </p>
</div>

<input
  type="number"
  value={goal}
  onChange={(e) => setGoal(Number(e.target.value))}
  className="mt-2 border rounded px-2 py-1 w-24"
/>

<div className="flex items-center justify-between mb-4">

  {/* IZQUIERDA: filtros */}
  <div className="flex gap-4">
    <select
      onChange={(e) => setFilter(e.target.value)}
      className="border border-gray-300 rounded px-2"
    >
      <option value="all">Todos</option>
      <option value="Leído">Leídos</option>
      <option value="Pendiente">Pendientes</option>
    </select>
  </div>

  {/* DERECHA: contadores */}
  <div className="text-sm text-gray-600 text-right">
    {filter === "all" && <p> Total: {totalBooks}</p>}
    {filter === "Leído" && <p> Leídos: {readCount}</p>}
    {filter === "Pendiente" && <p> Pendientes: {pendingCount}</p>}
  </div>

  <select
  onChange={(e) => setSortBy(e.target.value)}
  className="border border-gray-300 rounded px-2"
>
  <option value="">Ordenar por...</option>

  <option value="title_asc">Título A → Z</option>
  <option value="title_desc">Título Z → A</option>

  <option value="author_asc">Autor A → Z</option>
  <option value="author_desc">Autor Z → A</option>

  {filter === "Leído" && (
    <>
      <option value="date_desc">Más recientes</option>
      <option value="date_asc">Más antiguos</option>
    </>
  )}
</select>

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