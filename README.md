# Personal-library
PostgreSQL project to manage and catalog my personal library of 950+ books.

A full relational database system to organize and track my entire physical and digital book collection.
Created with Node.js, Express, and PostgreSQL.
This project started as a personal need to manage over 950 books, organize them by author, series, reading status, formats, and physical/digital location.
I turned it into a complete technical project to showcase skills in:

Database modeling

Normalization

Professional PostgreSQL usage

Bulk data loading & data cleaning

Relational design (PK, FK, constraints)

GitHub version control

Preparation for backend & frontend development



## Technologies Used

Node.js

Express

PostgreSQL

pg (node-postgres)

Thunder Client / Postman

## API Endpoints

1. Get all books

GET /api/books

Response (200):

[
  {
    "id": 1,
    "title": "Book title",
    "author_id": 3,
    "series_id": null,
    "genre": "Fantasy",
    "status": "Read",
    "format": "ePub"
  }
]

2. Get a book by ID

GET /api/books/:id

Example: /api/books/5

Response (200):

{
  "id": 5,
  "title": "Example Book",
  "author_id": 1,
  "series_id": null,
  "genre": "Drama",
  "status": "Reading",
  "format": "Paperback"
}


Errors:

404 Not Found — book does not exist

3. Create a new book

POST /api/books

Body example:
{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "series": "Middle-Earth",
  "genre": "Fantasy",
  "status": "Read",
  "format": "ePub"
}


If series is empty or null, the book is created without a series (series_id = NULL).

Response (201):

{
  "message": "Book created successfully"
}

4. Update a book

PATCH /api/books/:id

Body example:
{
  "format": "Paperback",
  "status": "Completed",
  "location": "iPhone/Books",
  "publication_year": 2013
}


Only provided fields are updated.

Response (200):

{
  "message": "Book updated successfully"
}


Errors:

404 Not Found — book does not exist

5. Delete a book

DELETE /api/books/:id

Example: /api/books/10

Response (200):

{ "message": "Book deleted successfully" }


Errors:

404 Not Found — book does not exist

## Database Structure
- Table: authors
Field	Type
author_id	SERIAL PRIMARY KEY
name	TEXT UNIQUE NOT NULL
- Table: series
Field	Type
series_id	SERIAL PRIMARY KEY
name	TEXT UNIQUE NOT NULL
- Table: books
Field	Type
id	SERIAL PRIMARY KEY
title	TEXT NOT NULL
author_id	INTEGER REFERENCES authors(id)
series_id	INTEGER REFERENCES series(id) NULL
genre	TEXT
status	TEXT
format	TEXT
location	TEXT
publication_year	INTEGER
- Useful Commands
Start the server
npm run dev

Install dependencies
npm install

- Testing with Thunder Client

To test the API:

Create a folder named Requests in the backend

Add files:

GET_all

POST_create

PATCH_update

DELETE_book

Test each endpoint using real IDs from the database

## Next Steps (Frontend)

After completing the backend:

Create the React + Vite frontend

Build UI for listing books

Add forms for creating/editing

Connect frontend to backend

Deploy (Render, Vercel, etc.)