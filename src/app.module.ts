import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { SecurityModule } from './shared/security/security.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    SecurityModule
  ],

  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, UserService]
})
export class AppModule {}
// { provide: APP_GUARD, useClass: AuthGuard }
