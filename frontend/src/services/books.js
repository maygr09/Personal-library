const API_URL = "http://localhost:3000/api/books";

export const createBook = async (book) => {
  const res = await fetch("http://localhost:3000/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });

  if (!res.ok) throw new Error("Error creating book");
  return res.json();
};


export const getBooks = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  return response.json();
};

export const getBookById = async (id) => {
  const res = await fetch(`http://localhost:3000/api/books/${id}`);
  if (!res.ok) throw new Error("Error fetching book");
  return res.json();
};

export const updateBook = async (id, book) => {
  const res = await fetch(`http://localhost:3000/api/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Error updating book");
  return res.json();
};

export const deleteBook = async (id) => {
  const res = await fetch(`http://localhost:3000/api/books/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error deleting book");
};