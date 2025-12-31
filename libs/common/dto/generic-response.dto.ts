import { ApiProperty } from '@nestjs/swagger';

export class GenericResponseDto {
  @ApiProperty({
    example: 'User registered successfully',
  })
  message: string;
}
