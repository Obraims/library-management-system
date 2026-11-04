import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const space = await this.prisma.space.findUnique({ where: { id: dto.spaceId } });
    if (!space) {
      throw new NotFoundException('Selected study space does not exist');
    }

    const bookingDate = new Date(dto.date);
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (start >= end) {
      throw new BadRequestException('startTime must be strictly before endTime');
    }

    // Server-side conflict check via Prisma findFirst
    const existingConflict = await this.prisma.booking.findFirst({
      where: {
        spaceId: dto.spaceId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } },
        ],
      },
    });

    if (existingConflict) {
      throw new ConflictException('Selected study space is already booked during this time slot.');
    }

    return this.prisma.booking.create({
      data: {
        userId,
        spaceId: dto.spaceId,
        date: bookingDate,
        startTime: start,
        endTime: end,
        purpose: dto.purpose,
        status: 'CONFIRMED',
      },
      include: { space: true, user: true },
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: { space: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { space: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
