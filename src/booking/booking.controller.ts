import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { currentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateBookingDto } from './dtos/create-booking.dto';
import type { JwtPayload } from 'src/auth/types/jwt-payload';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@currentUser() user: JwtPayload, @Body() dto: CreateBookingDto) {
    return this.bookingService.create(user.sub, dto);
  }

  @Get('my')
  getmyBookings(@currentUser() user: JwtPayload) {
    return this.bookingService.findMyBookings(user.sub);
  }

  @Roles('Admin')
  @Get()
  getBookings() {
    return this.bookingService.findAll();
  }
}
