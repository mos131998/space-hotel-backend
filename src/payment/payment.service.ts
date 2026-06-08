import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { TypedConfigService } from 'src/config/typed-config.service';
import {
  PAYMENT_CODE,
  PAYMENT_FLOW
} from 'src/booking/constants/payment.constants';
import { SubmitPaymentSlipDto } from './dtos/submit-payment-slip.dto';
import { ReviewPaymentDto } from './dtos/review-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: TypedConfigService
  ) {}

  async submitSlip(
    userId: number,
    bookingId: number,
    dto: SubmitPaymentSlipDto
  ) {
    const booking = await this.prismaService.booking.findFirst({
      where: {
        id: bookingId,
        userId
      }
    });

    if (!booking) {
      throw new NotFoundException(PAYMENT_CODE.BOOKING_NOT_FOUND);
    }

    if (booking.paymentStatus === PAYMENT_FLOW.SUCCESS_STATUS) {
      throw new ConflictException(PAYMENT_CODE.BOOKING_ALREADY_APPROVED);
    }
    if (booking.paymentStatus === PAYMENT_FLOW.REVIEW_STATUS) {
      throw new ConflictException(PAYMENT_CODE.PAYMENT_ALREADY_UNDER_REVIEW);
    }

    if (booking.paymentStatus === PAYMENT_FLOW.FAILURE_STATUS) {
      throw new ConflictException(PAYMENT_CODE.PAYMENT_ALREADY_FAILED);
    }

    return this.prismaService.booking.update({
      where: { id: booking.id },
      data: {
        slipUrl: dto.slipUrl,
        paymentStatus: PAYMENT_FLOW.REVIEW_STATUS
      }
    });
  }

  async reviewPayment(bookingId: number, dto: ReviewPaymentDto) {
    const booking = await this.prismaService.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      throw new NotFoundException(PAYMENT_CODE.BOOKING_NOT_FOUND);
    }
    if (booking.paymentStatus === PAYMENT_FLOW.SUCCESS_STATUS) {
      throw new ConflictException(PAYMENT_CODE.BOOKING_ALREADY_APPROVED);
    }
    if (booking.paymentStatus === PAYMENT_FLOW.FAILURE_STATUS) {
      throw new ConflictException(PAYMENT_CODE.PAYMENT_ALREADY_FAILED);
    }
    if (!booking.slipUrl) {
      throw new BadRequestException(PAYMENT_CODE.PAYMENT_SLIP_REQUIRED);
    }

    return this.prismaService.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: dto.approved
          ? PAYMENT_FLOW.SUCCESS_STATUS
          : PAYMENT_FLOW.FAILURE_STATUS
      }
    });
  }

  async getPaymentInfo(userId: number, bookingId: number) {
    const booking = await this.prismaService.booking.findFirst({
      where: {
        id: bookingId,
        userId
      },
      include: {
        room: true
      }
    });

    if (!booking) {
      throw new NotFoundException(PAYMENT_CODE.BOOKING_NOT_FOUND);
    }

    return {
      bookingId: booking.id,
      amount: booking.total,
      discount: booking.discount,
      status: booking.paymentStatus,
      slipUrl: booking.slipUrl,
      currency: this.configService.get('PAYMENT_CURRENCY'),
      reviewExpiresHours: this.configService.get('PAYMENT_REVIEW_EXPIRES_HOURS')
    };
  }
}
