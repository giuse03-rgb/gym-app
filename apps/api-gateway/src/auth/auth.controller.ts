import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RegisterAuthRequestDto } from 'libs/common/dto/register-auth.request.dto';
import { GenericResponseDto } from 'libs/common/dto/generic.response.dto';
import { LoginAuthRequestDto } from 'libs/common/dto/login-auth.request.dto';
import { LoginAuthResponseDto } from 'libs/common/dto/login-auth.response.dto';

import { AuthService } from './auth.service';
import { JwtGuard } from '../guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with email and password',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: GenericResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  public register(@Body() dto: RegisterAuthRequestDto): Promise<GenericResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Authenticate the user',
  })
  @ApiResponse({
    status: 201,
    description: 'User authenticated successfully',
    type: LoginAuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  public login(@Body() dto: LoginAuthRequestDto): Promise<LoginAuthResponseDto> {
    return this.authService.login(dto);
  }
}
