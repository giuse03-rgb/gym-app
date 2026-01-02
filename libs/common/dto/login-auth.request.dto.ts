import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthRequestDto {
  @ApiProperty({
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
