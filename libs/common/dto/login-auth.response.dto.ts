import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJpYXQiOjE2OTAwMDAwMDAsImV4cCI6MTY5MDAwMzYwMH0.signature',
  })
  accessToken: string;
}
