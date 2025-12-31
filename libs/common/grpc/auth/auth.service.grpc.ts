import { GenericResponseDto } from 'libs/common/dto/generic-response.dto';
import { RegisterAuthRequestDto } from 'libs/common/dto/register.dto';

export interface AuthServiceGrpc {
  register(dto: RegisterAuthRequestDto): Promise<GenericResponseDto>;
}
