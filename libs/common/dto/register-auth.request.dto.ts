import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

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
    minLength: 3,
    maxLength: 30,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;
}
