import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { UserWithOutPassword } from 'src/user/types/user.tpye';
import { currentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dtos/login.dto';
import { registerDto } from './dtos/register.dto';
import type { JwtPayload } from './types/jwt-payload';
import { ResponseMessage } from 'src/common/decorators/message-response.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ResponseMessage('account create apply')
  @Public()
  @Post('register')
  async register(@Body() registerDto: registerDto): Promise<void> {
    await this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto
  ): Promise<{ accessToken: string; user: UserWithOutPassword }> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  async getCurrentUser(
    @currentUser() user: JwtPayload
  ): Promise<UserWithOutPassword> {
    console.log(user);
    return this.authService.getCurrentUser(user.sub);
  }
}
