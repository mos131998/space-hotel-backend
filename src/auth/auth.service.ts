import { Injectable } from '@nestjs/common';
import { registerDto } from './dtos/register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerDto: registerDto): Promise<void> {
    await this.userService.create(registerDto);
  }
}
