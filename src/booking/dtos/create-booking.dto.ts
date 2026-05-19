import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @Type(() => Number)
  roomId!: number;

  @IsDateString()
  checkIn!: string;

  @IsDateString()
  checkOut!: string;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  totalhuman!: number;
}
