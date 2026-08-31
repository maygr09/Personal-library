import BookSpine from "./BookSpine";

export default function GenreShelf({ genre, books, onSelectBook }) {
  return (
    <section>
      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
        {genre}{" "}
        <span className="text-gray-400 font-normal normal-case">
          ({books.length})
        </span>
      </h3>

      <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1">
        {books.map((book) => (
          <BookSpine
            key={book.id}
            book={book}
            onClick={() => onSelectBook(book)}
          />
        ))}
      </div>

      {/* línea que marca el estante debajo de los libros */}
      <div className="h-2 bg-amber-800/20 rounded-full -mt-1" />
    </section>
  );
}
