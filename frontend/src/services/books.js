import { api } from "./api";

export const createBook = (book) =>
  api("/api/books", { method: "POST", body: book });

export const getBooks = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return api(`/api/books?${params}`);
};

export const searchBooks = (query) =>
  api(`/api/books/search?q=${encodeURIComponent(query)}`);

export const getBookById = (id) => api(`/api/books/${id}`);

export const updateBook = (id, book) =>
  api(`/api/books/${id}`, { method: "PUT", body: book });

export const deleteBook = (id) =>
  api(`/api/books/${id}`, { method: "DELETE" });
