import { Module } from '@nestjs/common';
import { AuthTokenService } from './services/auth-token.service';
import { BcryptService } from './services/bcrypt.service';

@Module({
  providers: [AuthTokenService, BcryptService]
})
export class SecurityModule {}
