import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { OmitType } from '@nestjs/swagger';

export class registerDto extends OmitType(CreateUserDto, []) {}
