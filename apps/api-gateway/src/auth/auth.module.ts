import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import 'dotenv/config';

import { AUTH_GRPC_BASE_OPTIONS } from 'libs/common/grpc/auth.grpc.options';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: AUTH_GRPC_BASE_OPTIONS.transport,
        options: {
          package: AUTH_GRPC_BASE_OPTIONS.options.package,
          protoPath: AUTH_GRPC_BASE_OPTIONS.options.protoPath,
          url: `${process.env.AUTH_SERVICE_HOST}:${process.env.AUTH_SERVICE_PORT}`,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
