import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import { User } from 'src/database/generated/prisma/client';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dtos/login.dto';
import { registerDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: registerDto): Promise<string> {
    await this.authService.register(registerDto);
    return 'account create apply';
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto
  ): Promise<{ accessToken: string; user: Omit<User, 'password'> }> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  async getCurrentUser() {}
}
