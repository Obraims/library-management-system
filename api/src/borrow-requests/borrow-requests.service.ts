import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { UpdateBorrowStatusDto } from './dto/update-borrow-status.dto';
import { calculateFine } from './fine-calculator';

@Injectable()
export class BorrowRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBorrowRequestDto) {
    const book = await this.prisma.book.findUnique({ where: { id: dto.bookId } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.availableCopies <= 0) {
      throw new BadRequestException('No available copies remaining for this book');
    }

    const requestDate = new Date();
    const dueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    return this.prisma.borrowRequest.create({
      data: {
        userId,
        bookId: dto.bookId,
        requestDate,
        dueDate,
        status: 'PENDING',
      },
      include: { book: true, user: true },
    });
  }

  async updateStatus(id: string, dto: UpdateBorrowStatusDto) {
    const request = await this.prisma.borrowRequest.findUnique({ where: { id } });
    if (!request) {
      throw new NotFoundException('Borrow request not found');
    }

    let fineAmount = request.fineAmount;
    let returnDate = request.returnDate;

    if (dto.status === 'RETURNED') {
      returnDate = dto.returnDate ? new Date(dto.returnDate) : new Date();
      fineAmount = calculateFine(request.dueDate, returnDate, 1.0);

      // Increment available copies on return
      await this.prisma.book.update({
        where: { id: request.bookId },
        data: { availableCopies: { increment: 1 } },
      });
    } else if (dto.status === 'APPROVED' && request.status === 'PENDING') {
      // Decrement available copies on approval
      await this.prisma.book.update({
        where: { id: request.bookId },
        data: { availableCopies: { decrement: 1 } },
      });
    }

    return this.prisma.borrowRequest.update({
      where: { id },
      data: {
        status: dto.status as any,
        returnDate,
        fineAmount,
      },
      include: { book: true, user: true },
    });
  }

  async findAll() {
    return this.prisma.borrowRequest.findMany({
      include: { book: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.borrowRequest.findMany({
      where: { userId },
      include: { book: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
