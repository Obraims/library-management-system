import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { BorrowRequestsModule } from '../borrow-requests/borrow-requests.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [BorrowRequestsModule, BookingsModule],
  controllers: [AdminController],
})
export class AdminModule {}
