import { Body, Controller, Post } from '@nestjs/common';

import { RegisterAuthRequestDto } from 'libs/common/dto/register.dto';
import { GenericResponseDto } from 'libs/common/dto/generic-response.dto';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public register(@Body() dto: RegisterAuthRequestDto): Promise<GenericResponseDto> {
    return this.authService.register(dto);
  }
}
