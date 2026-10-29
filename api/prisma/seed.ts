import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Optional: clear existing records in safe order
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  // Create genres matching the 4 curriculum categories
  const genreNames = ["Fantasy", "Science Fiction", "Mystery", "Biography"];
  const genres = await Promise.all(
    genreNames.map((name) =>
      prisma.genre.create({
        data: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
      }),
    ),
  );

  // 16 curated real-world books distributed across all 4 genres
  const sampleBooks = [
    // Fantasy (4 books)
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      coverImage: "https://images.example.com/the-hobbit.jpg",
    },
    {
      title: "The Fellowship of the Ring",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      coverImage: "https://images.example.com/fellowship.jpg",
    },
    {
      title: "A Game of Thrones",
      author: "George R.R. Martin",
      genre: "Fantasy",
      coverImage: "https://images.example.com/got.jpg",
    },
    {
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
      genre: "Fantasy",
      coverImage: "https://images.example.com/notw.jpg",
    },

    // Science Fiction (4 books)
    {
      title: "Dune",
      author: "Frank Herbert",
      genre: "Science Fiction",
      coverImage: "https://images.example.com/dune.jpg",
    },
    {
      title: "Neuromancer",
      author: "William Gibson",
      genre: "Science Fiction",
      coverImage: "https://images.example.com/neuromancer.jpg",
    },
    {
      title: "Foundation",
      author: "Isaac Asimov",
      genre: "Science Fiction",
      coverImage: "https://images.example.com/foundation.jpg",
    },
    {
      title: "Ender's Game",
      author: "Orson Scott Card",
      genre: "Science Fiction",
      coverImage: "https://images.example.com/enders-game.jpg",
    },

    // Mystery (4 books)
    {
      title: "The Big Sleep",
      author: "Raymond Chandler",
      genre: "Mystery",
      coverImage: "https://images.example.com/big-sleep.jpg",
    },
    {
      title: "The Hound of the Baskervilles",
      author: "Arthur Conan Doyle",
      genre: "Mystery",
      coverImage: "https://images.example.com/hound.jpg",
    },
    {
      title: "Gone Girl",
      author: "Gillian Flynn",
      genre: "Mystery",
      coverImage: "https://images.example.com/gone-girl.jpg",
    },
    {
      title: "And Then There Were None",
      author: "Agatha Christie",
      genre: "Mystery",
      coverImage: "https://images.example.com/and-then-there-were-none.jpg",
    },

    // Biography (4 books)
    {
      title: "Educated",
      author: "Tara Westover",
      genre: "Biography",
      coverImage: "https://images.example.com/educated.jpg",
    },
    {
      title: "Steve Jobs",
      author: "Walter Isaacson",
      genre: "Biography",
      coverImage: "https://images.example.com/steve-jobs.jpg",
    },
    {
      title: "The Diary of a Young Girl",
      author: "Anne Frank",
      genre: "Biography",
      coverImage: "https://images.example.com/anne-frank.jpg",
    },
    {
      title: "Shoe Dog: A Memoir by the Creator of Nike",
      author: "Phil Knight",
      genre: "Biography",
      coverImage: "https://images.example.com/shoe-dog.jpg",
    },
  ];

  console.log(`Inserting ${sampleBooks.length} books across 4 genres...`);
  for (const book of sampleBooks) {
    const genre = genres.find((g) => g.name === book.genre);
    if (!genre) continue;

    await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        isbn: `978${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        description: `${book.title} by ${book.author}. A notable work in the ${book.genre} genre.`,
        coverImage: book.coverImage,
        totalCopies: 3,
        availableCopies: 3,
        genreId: genre.id,
      },
    });
  }

  // Sample users with Role enum
  const patron = await prisma.user.create({
    data: {
      email: "patron@example.com",
      password: "hashed_password_patron_123",
      role: Role.PATRON,
    },
  });

  await prisma.user.create({
    data: {
      email: "librarian@example.com",
      password: "hashed_password_librarian_123",
      role: Role.LIBRARIAN,
    },
  });

  // Sample review (Stretch goal)
  const firstBook = await prisma.book.findFirst({ where: { title: "Dune" } });
  if (firstBook) {
    await prisma.review.create({
      data: {
        bookId: firstBook.id,
        userId: patron.id,
        rating: 5,
        comment: "A science fiction masterpiece of political intrigue, ecology, and destiny.",
      },
    });
  }

  console.log("✅ Seeding completed successfully!");
  console.log("Summary:");
  console.log(` - 4 Genres created: ${genreNames.join(", ")}`);
  console.log(` - ${sampleBooks.length} Books created`);
  console.log(" - 2 Users created (1 PATRON, 1 LIBRARIAN)");
  console.log(" - 1 Review created");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());