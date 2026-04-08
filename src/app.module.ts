import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { SecurityModule } from './shared/security/security.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    SecurityModule,
    RoomModule
  ],

  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    UserService
  ]
})
export class AppModule {}
// { provide: APP_GUARD, useClass: AuthGuard }
