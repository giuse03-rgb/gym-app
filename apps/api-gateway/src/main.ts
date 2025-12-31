import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { ApiGatewayModule } from './api-gateway.module';
import { GrpcToHttpInterceptor } from './interceptors/grpc-to-http.interceptor';

async function bootstrap() {
  const logger = new Logger('ApiGatewayBootstrap');

  const app = await NestFactory.create(ApiGatewayModule);

  app.useGlobalInterceptors(new GrpcToHttpInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port: number = Number(process.env.API_GATEWAY_PORT);

  await app.listen(port);
  logger.log(`Api Gateway running on port ${port}`);
}
bootstrap();
