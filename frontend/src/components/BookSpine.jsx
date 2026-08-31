import { colorForGenre } from "../utils/genreColors";

export default function BookSpine({ book, onClick }) {
  const { bg, gold, text } = colorForGenre(book.genre);

  return (
    <button
      onClick={onClick}
      title={book.title}
      className="relative flex-shrink-0 w-28 h-40 font-serif text-left cursor-pointer shadow-md hover:-translate-y-1 hover:shadow-xl transition-transform"
      style={{ backgroundColor: bg, border: `2px solid ${gold}` }}
    >
      {/* filete dorado superior */}
      <div
        className="absolute top-3 left-1.5 right-1.5 h-[2px]"
        style={{ backgroundColor: gold }}
      />
      {/* filete dorado inferior, separando la franja del autor */}
      <div
        className="absolute bottom-6 left-1.5 right-1.5 h-[2px]"
        style={{ backgroundColor: gold }}
      />

      <div className="h-full flex flex-col p-2 pt-5 pb-7">
        <span
          className="text-[11px] font-semibold leading-snug tracking-wide line-clamp-4"
          style={{ color: text }}
        >
          {book.title}
        </span>
      </div>

      <span
        className="absolute bottom-1.5 left-2 right-2 text-[9px] italic truncate opacity-90"
        style={{ color: text }}
      >
        {book.author_name}
      </span>
    </button>
  );
}
