import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { PAYMENT_DEFAULT, PAYMENT_FLOW } from './constants/payment.constants';

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

    if (checkOut <= checkIn) {
      throw new BadRequestException(
        'Check-out date must be after check-in date'
      );
    }

    if (dto.totalhuman > room.maxtotalhuman) {
      throw new BadRequestException('Guest count exceeds room capacity');
    }

    const conflict = await this.prismaService.booking.findFirst({
      where: {
        roomId: dto.roomId,
        paymentStatus: { not: PAYMENT_FLOW.FAILURE_STATUS },
        AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }]
      }
    });
    if (conflict) {
      throw new BadRequestException(
        'This room is already booked for the selected dates'
      );
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
        discount: PAYMENT_DEFAULT.DISCOUNT,
        paymentStatus: PAYMENT_FLOW.DEFAULT_STATUS,
        slipUrl: PAYMENT_DEFAULT.SLIP_URL
      }
    });
  }

  async findMyBookings(userId: number) {
    return this.prismaService.booking.findMany({
      where: { userId },
      include: {
        room: { include: { roomImages: { orderBy: { id: 'asc' } } } }
      },
      orderBy: { created_At: 'desc' }
    });
  }

  async findAll() {
    return this.prismaService.booking.findMany({
      include: {
        user: true,
        room: { include: { roomImages: { orderBy: { id: 'asc' } } } }
      },
      orderBy: { created_At: 'desc' }
    });
  }
}
