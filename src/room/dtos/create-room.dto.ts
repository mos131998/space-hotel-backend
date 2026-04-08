import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString
} from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';

export class CreateRoomDto {
  @Trim()
  @IsString({ message: 'roomName must be a string' })
  @IsNotEmpty({ message: 'roomName  is required' })
  roomName!: string;

  @IsPositive()
  @IsInt()
  @Type(() => Number)
  roomNumber!: number;

  @Type(() => Number)
  @IsInt()
  price!: number;

  @Type(() => Number)
  @IsInt()
  size!: number;

  @Type(() => Number)
  @IsInt()
  maxAdult!: number;

  @Type(() => Number)
  @IsInt()
  maxChildren!: number;

  @Type(() => Number)
  @IsInt()
  maxtotalhuman!: number;

  @IsBoolean()
  bathRoom!: boolean;

  @IsBoolean()
  bathTup!: boolean;
}
