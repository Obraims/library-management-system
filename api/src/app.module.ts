import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BorrowRequestsModule } from './borrow-requests/borrow-requests.module';
import { BookingsModule } from './bookings/bookings.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, AuthModule, BorrowRequestsModule, BookingsModule, AdminModule],
})
export class AppModule {}
