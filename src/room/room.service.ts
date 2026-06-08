import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateRoomDto } from './dtos/create-room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRoomDto: CreateRoomDto) {
    return this.prisma.room.create({ data: createRoomDto });
  }

  findAll() {
    return this.prisma.room.findMany({
      include: { roomImages: { orderBy: { id: 'asc' } } }
    });
  }

  fineOne(id: number) {
    return this.prisma.room.findUnique({
      where: { id },
      include: { roomImages: { orderBy: { id: 'asc' } } }
    });
  }

  update(id: number, updateRoomDto: Partial<CreateRoomDto>) {
    return this.prisma.room.update({ where: { id }, data: updateRoomDto });
  }

  delete(id: number) {
    return this.prisma.room.delete({ where: { id } });
  }
}
