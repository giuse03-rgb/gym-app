import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

import { Role } from '../enum/roles.enum';

export class RegisterAuthRequestDto {
  @ApiProperty({
    example: 'john_doe',
    minLength: 3,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({
    example: 'Password123',
    minLength: 8,
    maxLength: 72,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @ApiProperty({
    enum: Role,
    example: Role.USER,
  })
  @IsEnum(Role)
  role: Role;
}
