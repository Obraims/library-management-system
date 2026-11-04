# Library Management System

A NestJS + Prisma + PostgreSQL backend for a library: book catalog, borrow tracking, study space bookings and admin routes.

## Schema Decisions

The data layer lives in `api/prisma/schema.prisma`.

### Why `Book` references `Genre` instead of embedding it

`Book` stores a `genreId` foreign key with a `@relation` to `Genre`, rather than copying the genre's name or details into every book row.

- **One source of truth.** A genre exists once. Renaming "Sci-Fi" to "Science Fiction" is a single-row update, not an edit across every book that mentions it.
- **No inconsistent data.** Embedded copies can drift ("Mystery", "mystery", "Mysteries"). A foreign key means every book points at a real `Genre` row, and PostgreSQL enforces that the row exists.
- **Genres are queried on their own.** The app lists genres, filters books by genre and counts books per genre. With a separate `Genre` table these are simple indexed lookups and `include`/`where` queries, with no scanning of every book.
- **Genres can grow.** Description, display order or a parent genre can be added to `Genre` later without touching `Book`.
- **Trade-off.** Reading a book with its genre needs a join (`include: { genre: true }` in Prisma). For a catalog that is read far more than genres change, this is cheap and worth the integrity.

### Other decisions

- **`Role` enum (`PATRON`, `LIBRARIAN`)** on `User`, defaulting to `PATRON`. An enum limits the column to known values at the database level, and roles drive the `RolesGuard` on admin routes.
- **UUID primary keys** on every model, so ids are not guessable or sequential.
- **Unique constraints** on `User.email`, `Genre.name` and `Book.isbn` to stop duplicates.
- **`Review` model (stretch)** links `Book` and `User` (`bookId`, `userId`, `rating`, `comment`), so a book has many reviews and a user writes many reviews.
- **Seed script** (`api/prisma/seed.ts`) inserts 5 genres and 16 books spread across them. It uses `upsert`, so it can be run more than once without creating duplicates.

### Prisma vs. a document database

In a document database such as MongoDB, my first instinct would have been to embed the genre inside each book document. In Prisma the relation is declared explicitly, the database enforces it, and the generated client is fully typed, so a wrong `genreId` fails at the database instead of silently storing bad data.

---

This repository contains the backend implementation for borrow tracking, study space bookings, and protected admin routes built with NestJS, Prisma ORM, and PostgreSQL.

## Features Implemented
1. **Prisma Schema (`api/prisma/schema.prisma`)**:
   - `BorrowStatus` (`PENDING`, `APPROVED`, `REJECTED`, `RETURNED`, `OVERDUE`) and `BookingStatus` (`PENDING`, `CONFIRMED`, `CANCELLED`) enums.
   - `BorrowRequest`, `Space`, and `Booking` models with full relational constraints to `User` and `Book`.

2. **Borrow Tracking (`POST /borrow-requests`, `PATCH /borrow-requests/:id/status`)**:
   - `POST /borrow-requests` creates a borrow request from reading list items.
   - `PATCH /borrow-requests/:id/status` (Librarian only) updates status and automatically computes late fines.

3. **Fine Calculator & Unit Testing (`fine-calculator.ts` & `fine-calculator.spec.ts`)**:
   - Pure typed `calculateFine(dueDate, returnDate, ratePerDay)` function.
   - Unit tests covering on-time returns ($0.00 fine) and late returns (accurate daily rate computation).

4. **Space Booking with Overlap Conflict Checks (`POST /bookings`)**:
   - Server-side conflict detection via Prisma `findFirst` checking time overlaps (`startTime < newEnd AND endTime > newStart`).
   - Throws `ConflictException` (409) if the space is already booked.

5. **Admin Routes (`/admin/borrow-requests`, `/admin/bookings`)**:
   - Protected with `@Roles(Role.LIBRARIAN)` and `RolesGuard`.

## Week 2: Catalog CRUD and Authentication

- Genre and book CRUD routes are registered by the root application module. Creating, updating, and deleting either resource requires a librarian JWT.
- `GET /books` accepts `genreId`, `search`, `page`, and `limit`; search matches title and author, and results include pagination metadata.
- Book and genre request DTOs are validated with `class-validator`.
- `POST /auth/register` creates patron accounts with bcrypt-hashed passwords. `POST /auth/login` verifies credentials and returns a JWT.
- Set a unique `JWT_SECRET` in `api/.env` before starting the API. Public registration cannot assign the librarian role.
- `GET /users/profile` returns the authenticated user's non-sensitive profile.
- Import `docs/postman_collection.json` to try the week's auth, genre, book, and profile endpoints.

## Running Unit Tests
```bash
cd api
npm run test
```

## Setup Instructions
```bash
cd api
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```
