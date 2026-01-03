import { GenericResponseDto } from 'libs/common/dto/generic.response.dto';
import { RegisterAuthRequestDto } from 'libs/common/dto/register-auth.request.dto';
import { LoginAuthRequestDto } from 'libs/common/dto/login-auth.request.dto';
import { LoginAuthResponseDto } from 'libs/common/dto/login-auth.response.dto';

export interface AuthServiceGrpc {
  register(dto: RegisterAuthRequestDto): Promise<GenericResponseDto>;
  login(dto: LoginAuthRequestDto): Promise<LoginAuthResponseDto>;
}
