import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { INestMicroservice, Logger, ValidationPipe } from '@nestjs/common';

import { AUTH_GRPC_BASE_OPTIONS } from 'libs/common/grpc/auth.grpc.options';

import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const logger = new Logger('AuthServiceBootstrap');

  const port: number = Number(process.env.AUTH_SERVICE_PORT);

  const app: INestMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: AUTH_GRPC_BASE_OPTIONS.transport,
      options: {
        package: AUTH_GRPC_BASE_OPTIONS.options.package,
        protoPath: AUTH_GRPC_BASE_OPTIONS.options.protoPath,
        url: `0.0.0.0:${port}`,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();

  logger.log(`Auth service running on port ${port}`);
}
bootstrap();
