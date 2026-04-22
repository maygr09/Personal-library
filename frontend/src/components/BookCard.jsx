import { Link } from "react-router-dom";
import { deleteBook } from "../services/books";

export default function BookCard({ book }) {

  const handleDelete = async () => {
    if (confirm("Delete this book?")) {
      await deleteBook(book.id);
      window.location.reload();
    }
  };

  const getYearLabel = () => {
    if (book.date_unknown) return null;

    const start = book.date_started;
    const end = book.date_finished;

    if (!start && !end) return null;

    const startYear = start ? new Date(start).getFullYear() : null;
    const endYear = end ? new Date(end).getFullYear() : null;

    if (startYear && endYear) {
      return startYear === endYear
        ? `${startYear}`
        : `${startYear}–${endYear}`;
  }

  return startYear || endYear;
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold">{book.title}</h2>

      <p className="text-sm text-gray-700">
        {book.author_name}
      </p>

      {book.series_name && (
        <p className="text-sm italic text-gray-600">
          {book.series_name}
          {book.series_order && ` · Book ${book.series_order}`}
        </p>
      )}

      <p className="mt-2 text-sm">
        Status: {book.status}
      </p>

      {book.status === "Leído" && (
  <>
    {!book.date_unknown ? (
      <div className="text-sm text-gray-600">
        {book.date_started && <p>Started: {book.date_started}</p>}
        {book.date_finished && <p>Finished: {book.date_finished}</p>}

        {getYearLabel() && (
          <p className="text-gray-500">{getYearLabel()}</p>
        )}
      </div>
    ) : (
      <p className="text-sm text-gray-400 italic">
        Fecha desconocida
      </p>
    )}
  </>
)}

      {book.rating && (
        <p className="mt-2 text-sm">Rating: ⭐ {book.rating}</p>
      )}

      <div className="mt-2 text-xs text-gray-500">
        {book.format && <span>{book.format}</span>}
        {book.genre && <span> · {book.genre}</span>}
        {book.publication_year && (
          <span> · {book.publication_year}</span>
        )}
      </div>

      {book.notes && (
        <p className="mt-3 text-sm text-gray-700">
          {book.notes}
        </p>
      )}

      {/* BOTONES */}
      <div className="mt-3 flex gap-3">
        <Link
          to={`/edit/${book.id}`}
          className="text-sm text-purple-600 hover:underline"
        >
          Edit
        </Link>

        <button
          onClick={handleDelete}
          className="text-sm text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}