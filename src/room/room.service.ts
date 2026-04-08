import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateRoomDto } from './dtos/create-room.dto';
import { Room } from 'src/database/generated/prisma/client';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRoomDto: CreateRoomDto): Promise<Room> {
    return this.prisma.room.create({ data: createRoomDto });
  }

  findAll(): Promise<Room[]> {
    return this.prisma.room.findMany();
  }

  fineOne(id: number): Promise<Room | null> {
    return this.prisma.room.findUnique({ where: { id } });
  }

  update(id: number, updateRoomDto: Partial<CreateRoomDto>): Promise<Room> {
    return this.prisma.room.update({ where: { id }, data: updateRoomDto });
  }

  delete(id: number): Promise<Room> {
    return this.prisma.room.delete({ where: { id } });
  }
}
