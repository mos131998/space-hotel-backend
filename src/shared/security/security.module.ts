import { Module } from '@nestjs/common';
import { AuthTokenService } from './services/auth-token.service';
import { BcryptService } from './services/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [AuthTokenService, BcryptService],
  exports: [AuthTokenService, BcryptService]
})
export class SecurityModule {}
