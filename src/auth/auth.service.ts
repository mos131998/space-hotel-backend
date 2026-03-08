import { Injectable, UnauthorizedException } from '@nestjs/common';
import { registerDto } from './dtos/register.dto';
import { UserService } from 'src/user/user.service';
import { BcryptService } from 'src/shared/security/services/bcrypt.service';
import { LoginDto } from './dtos/login.dto';
import { User } from 'src/database/generated/prisma/client';
import { AuthTokenService } from 'src/shared/security/services/auth-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly authTokenService: AuthTokenService
  ) {}

  async register(registerDto: registerDto): Promise<void> {
    await this.userService.create(registerDto);
  }

  async login(
    loginDto: LoginDto
  ): Promise<{ accessToken: string; user: User }> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user)
      throw new UnauthorizedException({
        message: 'email or password is incorrect',
        code: 'INVALID_CREDENTIALS'
      });
    const isMath = await this.bcryptService.compare(
      loginDto.password,
      user.password
    );
    if (!isMath)
      throw new UnauthorizedException({
        message: 'email or password is incorrect',
        code: 'INVALID_CREDENTIALS'
      });
    const accessToken = await this.authTokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    });

    return { accessToken, user };
  }
}
