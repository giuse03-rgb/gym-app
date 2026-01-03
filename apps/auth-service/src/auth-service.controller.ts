import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { GenericResponseDto } from 'libs/common/dto/generic.response.dto';
import { RegisterAuthRequestDto } from 'libs/common/dto/register-auth.request.dto';
import { LoginAuthRequestDto } from 'libs/common/dto/login-auth.request.dto';
import { LoginAuthResponseDto } from 'libs/common/dto/login-auth.response.dto';

import { AuthService } from './auth.service';

@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  public register(dto: RegisterAuthRequestDto): Promise<GenericResponseDto> {
    return this.authService.register(dto);
  }

  @GrpcMethod('AuthService', 'Login')
  public login(dto: LoginAuthRequestDto): Promise<LoginAuthResponseDto> {
    return this.authService.login(dto);
  }
}
