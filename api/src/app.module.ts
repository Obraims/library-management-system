import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BorrowRequestsModule } from './borrow-requests/borrow-requests.module';
import { BookingsModule } from './bookings/bookings.module';
import { AdminModule } from './admin/admin.module';
import { BooksModule } from './books/books.module';
import { GenresModule } from './genres/genres.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BooksModule,
    GenresModule,
    UsersModule,
    BorrowRequestsModule,
    BookingsModule,
    AdminModule,
  ],
})
export class AppModule {}
