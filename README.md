# Personal-library
PostgreSQL project to manage and catalog my personal library of 950+ books.

A full relational database system to organize and track my entire physical and digital book collection.
This project started as a personal need to manage over 950 books, organize them by author, series, reading status, formats, and physical/digital location.
I turned it into a complete technical project to showcase skills in:

Database modeling

Normalization

Professional PostgreSQL usage

Bulk data loading & data cleaning

Relational design (PK, FK, constraints)

GitHub version control

Preparation for backend & frontend development

 
## Tech Stack

PostgreSQL 16

SQL (DDL & DML)

Git & GitHub

CSV data imports

(Upcoming) Node.js + Express (REST API)

(Upcoming) React (TypeScript + Tailwind)


## Project structure

personal-library/

 database/

   schema.sql (full database structure)

   seeds.sql (sample seed data)

 csv/ (real data)

   ...

 diagrams/ (ER diagrams and documentation)

   er-diagram.png (to add)

 README.md


## Data Model (Summary)

Main tables:


- authors


author_id (PK)

name


- series


series_id (PK)

name


- books


id

title

original_title

series_id (FK)

author_id (FK)

series_order (decimal)

status

date_started

date_finished

date_unknown

rating

format

genre

location

publication_year

notes


## Relationships

One author → many books

One series → many books

Each book → one author + optional series

All fully normalized to avoid duplication.


## Current Features

- Fully normalized relational database


Prevents duplicates in authors

Enforces consistent year, date, and type values.

- Bulk data import from CSV


With validation for:

booleans

partial dates

empty fields

decimal series order values


- Useful queries included


Read vs unread books

Rating distribution

Books per author

Completed vs ongoing series

Physical vs digital location tracking


- API-ready


The database is structured for an easy backend integration.

# How to Run the Project

1. Clone the repository


2. Create the database

CREATE DATABASE personal_library;


3. Import the schema

psql -d personal_library -f database/schema.sql


4. Import the data

\copy books FROM 'csv/libros-libros.csv' WITH CSV HEADER;

## Roadmap

Completed

 Data cleaning and normalization

 Professional SQL schema
 
 Relationships and constraints
 
 CSV → PostgreSQL migration
 
 Full documentation (this README)


In Progress

 Backend REST API (Node.js + Express + Prisma/pg)


Future Plans

 React frontend (TypeScript + Vite + Tailwind)

 Advanced search
 
 Dashboard with charts
 
 Private login
 
 Mobile app (React Native or Expo)


## Project Purpose

What began as a way to organize my personal library… is now a polished technical project that demonstrates:

Ability to manage large structured datasets


Real SQL expertise 

System design & organization

Full-stack readiness

Clean GitHub workflow


It’s a system I actually use every day — and a key part of my portfolio.


## Author

Mayra Gómez

Cabin crew • Singer • Full-stack developer in training.
