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