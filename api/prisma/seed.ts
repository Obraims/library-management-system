import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const genreNames = [
  'Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Non-Fiction',
];

const books: {
  title: string;
  author: string;
  isbn: string;
  publishedYr: number;
  genre: string;
  totalCopies?: number;
  availableCopies?: number;
}[] = [
  // Fiction
  { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518', publishedYr: 1813, genre: 'Fiction', availableCopies: 4 },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084', publishedYr: 1960, genre: 'Fiction' },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', publishedYr: 1925, genre: 'Fiction' },

  // Science Fiction
  { title: 'Nineteen Eighty-Four', author: 'George Orwell', isbn: '9780451524935', publishedYr: 1949, genre: 'Science Fiction' },
  { title: 'Dune', author: 'Frank Herbert', isbn: '9780441013593', publishedYr: 1965, genre: 'Science Fiction' },
  { title: 'Neuromancer', author: 'William Gibson', isbn: '9780441569595', publishedYr: 1984, genre: 'Science Fiction' },
  { title: "Ender's Game", author: 'Orson Scott Card', isbn: '9780812550702', publishedYr: 1985, genre: 'Science Fiction' },

  // Fantasy
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '9780547928227', publishedYr: 1937, genre: 'Fantasy' },
  { title: 'A Game of Thrones', author: 'George R.R. Martin', isbn: '9780553593716', publishedYr: 1996, genre: 'Fantasy' },
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss', isbn: '9780756404741', publishedYr: 2007, genre: 'Fantasy' },

  // Mystery
  { title: 'Murder on the Orient Express', author: 'Agatha Christie', isbn: '9780062693662', publishedYr: 1934, genre: 'Mystery' },
  { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', isbn: '9780307454546', publishedYr: 2005, genre: 'Mystery' },
  { title: 'Gone Girl', author: 'Gillian Flynn', isbn: '9780307588371', publishedYr: 2012, genre: 'Mystery' },

  // Non-Fiction
  { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '9780062316110', publishedYr: 2011, genre: 'Non-Fiction' },
  { title: 'Atomic Habits', author: 'James Clear', isbn: '9780735211292', publishedYr: 2018, genre: 'Non-Fiction' },
  { title: 'Educated', author: 'Tara Westover', isbn: '9780399590504', publishedYr: 2018, genre: 'Non-Fiction' },
];

async function main() {
  console.log('Seeding database...');

  // Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'librarian@library.org' },
    update: {},
    create: {
      email: 'librarian@library.org',
      name: 'Head Librarian',
      password: hashedPassword,
      role: Role.LIBRARIAN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'patron@example.com' },
    update: {},
    create: {
      email: 'patron@example.com',
      name: 'Alex Patron',
      password: hashedPassword,
      role: Role.PATRON,
    },
  });

  // Genres
  const genreIds: Record<string, string> = {};
  for (const name of genreNames) {
    const genre = await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    genreIds[name] = genre.id;
  }

  // Books (each references its Genre via genreId)
  for (const { genre, ...book } of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: { ...book, genreId: genreIds[genre] },
    });
  }

  // Spaces
  await prisma.space.upsert({
    where: { name: 'Study Room A' },
    update: {},
    create: { name: 'Study Room A', capacity: 4, location: '2nd Floor - East Wing' },
  });

  await prisma.space.upsert({
    where: { name: 'Conference Room B' },
    update: {},
    create: { name: 'Conference Room B', capacity: 10, location: '3rd Floor - Main Hall' },
  });

  console.log(`Seeded ${genreNames.length} genres and ${books.length} books.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
