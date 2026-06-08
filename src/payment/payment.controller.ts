import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { currentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/types/jwt-payload';
import { SubmitPaymentSlipDto } from './dtos/submit-payment-slip.dto';
import { ReviewPaymentDto } from './dtos/review-payment.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get(':bookingId')
  getPaymentInfo(
    @currentUser() user: JwtPayload,
    @Param('bookingId', ParseIntPipe) bookingId: number
  ) {
    return this.paymentService.getPaymentInfo(user.sub, bookingId);
  }
  @Post(':bookingId/slip')
  submitSlip(
    @currentUser() user: JwtPayload,
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Body() dto: SubmitPaymentSlipDto
  ) {
    return this.paymentService.submitSlip(user.sub, bookingId, dto);
  }
  @Roles('Admin')
  @Patch(':bookingId/review')
  reviewPayment(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Body() dto: ReviewPaymentDto
  ) {
    return this.paymentService.reviewPayment(bookingId, dto);
  }
}
