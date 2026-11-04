import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { BorrowRequestsService } from '../borrow-requests/borrow-requests.service';
import { BookingsService } from '../bookings/bookings.service';
import { UpdateBorrowStatusDto } from '../borrow-requests/dto/update-borrow-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.LIBRARIAN)
export class AdminController {
  constructor(
    private readonly borrowRequestsService: BorrowRequestsService,
    private readonly bookingsService: BookingsService,
  ) {}

  @Get('borrow-requests')
  async getAllBorrowRequests() {
    return this.borrowRequestsService.findAll();
  }

  @Patch('borrow-requests/:id')
  async updateBorrowRequestStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBorrowStatusDto,
  ) {
    return this.borrowRequestsService.updateStatus(id, dto);
  }

  @Get('bookings')
  async getAllBookings() {
    return this.bookingsService.findAll();
  }
}
