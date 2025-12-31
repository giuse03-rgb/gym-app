import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { GenericResponseDto } from 'libs/common/dto/generic-response.dto';
import { RegisterAuthRequestDto } from 'libs/common/dto/register-auth.request.dto';

import { AuthService } from './auth.service';

@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  public register(dto: RegisterAuthRequestDto): Promise<GenericResponseDto> {
    return this.authService.register(dto);
  }
}
