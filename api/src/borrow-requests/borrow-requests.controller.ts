import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BorrowRequestsService } from './borrow-requests.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { UpdateBorrowStatusDto } from './dto/update-borrow-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('borrow-requests')
@UseGuards(JwtAuthGuard)
export class BorrowRequestsController {
  constructor(private readonly borrowRequestsService: BorrowRequestsService) {}

  @Post()
  async create(@Req() req, @Body() dto: CreateBorrowRequestDto) {
    return this.borrowRequestsService.create(req.user.id, dto);
  }

  @Get()
  async findAll(@Req() req) {
    if (req.user.role === Role.LIBRARIAN) {
      return this.borrowRequestsService.findAll();
    }
    return this.borrowRequestsService.findByUser(req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.LIBRARIAN)
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateBorrowStatusDto) {
    return this.borrowRequestsService.updateStatus(id, dto);
  }
}
