import { IsBoolean } from 'class-validator';

export class ReviewPaymentDto {
  @IsBoolean()
  approved!: boolean;
}
