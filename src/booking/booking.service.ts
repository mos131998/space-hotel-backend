import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBookingDto } from './dtos/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: number, dto: CreateBookingDto) {
    const room = await this.prismaService.room.findUnique({
      where: { id: dto.roomId }
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);
    const conFlict = await this.prismaService.booking.findFirst({
      where: {
        roomId: dto.roomId,
        paymentStatus: { not: 'FAILED' },
        AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }]
      }
    });
    if (conFlict) {
      throw new BadRequestException('ห้องนี้มีการจองในช่วงเวลานี้เเล้ว');
    }

    const days = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    const total = Number(room.price) * days;

    return this.prismaService.booking.create({
      data: {
        userId,
        roomId: dto.roomId,
        checkIn,
        checkOut,
        totalhuman: dto.totalhuman,
        total,
        discount: 0,
        paymentStatus: 'PENDING',
        slipUrl: ''
      }
    });
  }

  async findMyBookings(userId: number) {
    return this.prismaService.booking.findMany({
      where: { userId },
      include: { room: true }
    });
  }
}
