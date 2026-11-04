import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGenreDto) {
    const existing = await this.prisma.genre.findUnique({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('Genre name already exists');
    }
    return this.prisma.genre.create({ data: dto });
  }

  async findAll() {
    return this.prisma.genre.findMany({
      include: { _count: { select: { books: true } } },
    });
  }

  async findOne(id: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { books: true },
    });
    if (!genre) {
      throw new NotFoundException(`Genre with ID '${id}' not found`);
    }
    return genre;
  }

  async update(id: string, dto: UpdateGenreDto) {
    const genre = await this.findOne(id);
    if (dto.name && dto.name !== genre.name) {
      const existing = await this.prisma.genre.findUnique({ where: { name: dto.name } });
      if (existing) {
        throw new ConflictException('Genre name already exists');
      }
    }

    return this.prisma.genre.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const genre = await this.findOne(id);
    if (genre.books.length > 0) {
      throw new ConflictException('Cannot delete a genre that has books');
    }
    return this.prisma.genre.delete({ where: { id } });
  }
}
