import { useEffect } from "react";
import BookCard from "./BookCard";

export default function BookModal({ book, onClose }) {
  useEffect(() => {
    if (!book) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [book, onClose]);

  if (!book) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 book-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full book-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute -top-3 -right-3 bg-white rounded-full w-8 h-8 shadow flex items-center justify-center text-gray-600 hover:text-gray-900 z-10"
          >
            ✕
          </button>
          <BookCard book={book} />
        </div>
      </div>
    </div>
  );
}
