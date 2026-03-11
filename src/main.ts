import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new GlobalValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error(
    'nest application failed during bootstrap',
    error instanceof Error ? error.message : 'Unexpected occurred error'
  );
});
