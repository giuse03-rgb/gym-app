import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { GenericResponseDto } from 'libs/common/dto/generic-response.dto';
import { RegisterAuthRequestDto } from 'libs/common/dto/register-auth.request.dto';
import { AuthServiceGrpc } from 'libs/common/grpc/auth.service.grpc';

@Injectable()
export class AuthService implements OnModuleInit {
  private authServiceGrpc: AuthServiceGrpc;
  private readonly logger = new Logger(AuthService.name);

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  public onModuleInit(): void {
    this.authServiceGrpc = this.client.getService<AuthServiceGrpc>('AuthService');
    this.logger.log('AuthService gRPC client initialized');
  }

  public register(dto: RegisterAuthRequestDto): Promise<GenericResponseDto> {
    return this.authServiceGrpc.register(dto);
  }
}
