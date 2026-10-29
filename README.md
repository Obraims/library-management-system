# Library Management System

A production-ready library management backend built with **NestJS**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## Project Structure

```text
library-management-system/
├── README.md                   # System documentation & schema design notes
└── api/                        # NestJS backend application
    ├── .env.example            # Database environment variable template
    ├── nest-cli.json           # NestJS CLI configuration
    ├── package.json            # Project dependencies & Prisma seed command
    ├── tsconfig.json           # TypeScript compilation configuration
    ├── tsconfig.build.json     # Production build TypeScript configuration
    ├── prisma/
    │   ├── migrations/         # Prisma migration history
    │   ├── schema.prisma       # Prisma schema (User, Genre, Book, Review, Role enum)
    │   └── seed.ts             # Human-curated database seeding script
    └── src/
        ├── main.ts             # Application entry point
        ├── app.module.ts       # Root module importing PrismaModule
        ├── app.controller.ts   # Root health check controller
        ├── app.service.ts      # Root service
        └── prisma/
            ├── prisma.service.ts  # Prisma service extending PrismaClient with onModuleInit
            └── prisma.module.ts   # Global Prisma module
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **PostgreSQL**: Local or cloud PostgreSQL instance

### 2. Environment Configuration
Navigate into the `api` directory:
```bash
cd api
cp .env.example .env
```
Update `DATABASE_URL` in `api/.env` with your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

### 3. Installation
Install project dependencies:
```bash
npm install
```

### 4. Database Setup & Migrations
Generate the Prisma Client and apply migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Seeding the Database
Populate the database with human-curated data:
```bash
npx ts-node prisma/seed.ts
# or
npx prisma db seed
```
Confirm your books and genres appear:
```bash
npx prisma studio
```
This script automatically inserts:
- **4 Distinct Genres**: Fantasy, Science Fiction, Mystery, Biography (with unique slugs).
- **16 Human-Curated Books**: Realistic titles and authors distributed across all genres.
- **2 Users**: Demonstrating the `Role` enum (`PATRON` and `LIBRARIAN`).
- **1 Sample Review**: Demonstrating the relations between `Book` and `User`.

### 6. Running the Application
```bash
npm run start:dev
```
The API will be available at `http://localhost:3000/api`.

---

## Schema Decisions

Book references Genre via a genreId foreign key rather than embedding the genre name directly, because many books share one genre and genres are managed independently (renaming a genre should not require updating every book). User stores a `role` field using a Role enum so Postgres and TypeScript both reject any value other than PATRON or LIBRARIAN.

### Normalization & Relational Integrity Details

1. **Single Source of Truth & Normalization:** A genre represents an independent domain entity that possesses its own attributes (such as `name`, `slug`, and related books). Normalizing genres into a separate table guarantees that each genre definition exists in exactly one place.
2. **Preventing Data Inconsistency and Update Anomalies:** If genre names were embedded as raw strings across thousands of book records, renaming or updating a genre (e.g., correcting a typo or updating a category name) would require scanning and updating every single matching book. With a foreign key reference, updating a genre requires modifying a single row in the `Genre` table.
3. **Query Optimization & Categorical Aggregations:** Foreign key indexing (`genreId`) allows the database engine to perform efficient joins, index lookups, and aggregations (e.g., retrieving all books in a genre or calculating library inventory per genre) without relying on expensive full-text scans.
4. **Data Integrity via Foreign Key Constraints:** Relational constraints ensure that a book cannot be assigned to an invalid or non-existent genre, enforcing catalog consistency at the database level.

### Stretch Goal: Modeling in Prisma vs. a Document Database

Modeling this library schema in **Prisma (Relational/PostgreSQL)** versus a **Document Database (e.g., MongoDB/Mongoose)** highlighted fundamental architectural differences in how **relationships, consistency, and typing are handled**:

- **Strict Relational Normalization vs. Embedded Denormalization:** In document databases, embedding genres or reviews directly inside a book document optimizes for single-document reads. However, renaming a genre or analyzing cross-book statistics requires updating many documents or running slow map-reduce/aggregation pipelines. Prisma enforces normalized foreign keys (`genreId`) where updating a genre updates exactly one record.
- **Explicit Bidirectional Relations & Compile-Time Type Safety:** In Prisma, relations must be declared explicitly on both sides of the relationship (e.g., `Book.genre` $\leftrightarrow$ `Genre.books`, and `Review.book` $\leftrightarrow$ `Book.reviews`). Prisma's compiler reads this schema and automatically generates fully typed TypeScript interfaces where relational queries (such as `prisma.book.findMany({ include: { genre: true, reviews: true } })`) are strictly validated at compile time, eliminating runtime reference errors.
- **Database-Level Integrity Constraints vs. Application-Level Logic:** In a document database, handling cross-entity updates or cascading deletions requires complex application-level scripts. In contrast, relational databases enforce referential integrity at the database engine level. When a record is deleted, foreign key constraints prevent orphaned records or cleanly cascade deletions, guaranteeing consistency with zero manual boilerplate.