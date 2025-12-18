# Personal library

A full-stack application to manage and catalog a personal library of 950+ books, built from scratch using PostgreSQL, Node.js, Express, and React (Vite).

This project started as a personal need to organize a large physical and digital book collection and evolved into a complete production-ready system, covering database design, backend API development, frontend integration, and cloud deployment.

## Features

Full CRUD operations for books

Advanced search functionality:

Search by title, original title, author, and series

Case-insensitive search

Fuzzy matching with “Did you mean?” suggestions

Relational data model with:

- Authors

- Series

- Books

Clean UX:

- Real-time search

- Reset to full catalog when input is cleared

- Production deployment with separated frontend and backend

## Technical Highlights

Relational database modeling and normalization

Proper use of:

- Primary keys

- Foreign keys

- Constraints

Data migration from local PostgreSQL to cloud PostgreSQL

Environment-based configuration (local vs production)

Monorepo architecture (frontend + backend)

Debugging and fixing real production issues

## Tech Stack
Backend

- Node.js

- Express

- PostgreSQL

- node-postgres (pg)

- REST API

Frontend

- React

- Vite

- JavaScript

- CSS

Infrastructure / Tools

Render (Backend & PostgreSQL)

Vercel (Frontend)

GitHub

Thunder Client / Postman

##  Live Demo

Frontend (Vercel):
https://personal-library-gold.vercel.app

Backend API (Render):
https://personal-library-backend-tflw.onrender.com/api/books

## API Endpoints

Get all books
GET /api/books

Search books
GET /api/books/search?q=twilight


Supports:

Titles

Original titles

Authors

Series
Includes fuzzy matching and suggestions.

Get book by ID
GET /api/books/:id

Create a book
POST /api/books

Update a book
PATCH /api/books/:id

Delete a book
DELETE /api/books/:id

## Database Schema

authors

series

books

All relationships are enforced with foreign keys and constraints.

## What I Learned

Designing and migrating relational databases

Connecting backend services to cloud-hosted PostgreSQL

Managing environment variables across platforms

Deploying and debugging a real full-stack application

Handling search logic and UX considerations

## Status

- Backend complete
- Frontend complete
- Production deployment complete
