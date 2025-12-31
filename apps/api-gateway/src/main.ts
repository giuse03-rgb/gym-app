import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Gym App API')
    .setDescription('API Gateway for the Gym App')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port: number = Number(process.env.API_GATEWAY_PORT);

  await app.listen(port);
  logger.log(`Api Gateway running on port ${port}`);
}
bootstrap();
