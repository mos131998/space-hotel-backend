import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';

export class CreateUserDto {
  @IsEmail({}, { message: 'invalid Email format' })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  @Trim()
  email: string;

  @MinLength(4, { message: 'password must have at least 4 characters' })
  @IsAlphanumeric('sl-SI', { message: 'Password can contain only number' })
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  @Trim()
  password: string;

  @IsString({ message: 'firstName must be a string' })
  @IsNotEmpty({ message: 'firstName is required' })
  @Trim()
  firstName: string;

  @IsString({ message: 'lastName must be a string' })
  @IsNotEmpty({ message: 'lastName is required' })
  @Trim()
  lastName: string;
}
