import { IsUrl } from 'class-validator';

export class SubmitPaymentSlipDto {
  @IsUrl()
  slipUrl!: string;
}
