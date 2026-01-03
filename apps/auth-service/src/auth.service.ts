import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { status as Status } from '@grpc/grpc-js';
import { Repository } from 'typeorm';

import { GenericResponseDto } from 'libs/common/dto/generic.response.dto';
import { RegisterAuthRequestDto } from 'libs/common/dto/register-auth.request.dto';
import { LoginAuthRequestDto } from 'libs/common/dto/login-auth.request.dto';
import { LoginAuthResponseDto } from 'libs/common/dto/login-auth.response.dto';

import { AuthUser } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthUser) private readonly authUsersRepository: Repository<AuthUser>,
    private readonly jwtService: JwtService,
  ) {}

  public async register(dto: RegisterAuthRequestDto): Promise<GenericResponseDto> {
    try {
      const saltRounds: number = 10;
      const hashedPassword: string = await bcrypt.hash(dto.password, saltRounds);

      const authUser: AuthUser = this.authUsersRepository.create({
        ...dto,
        password: hashedPassword,
      });

      await this.authUsersRepository.save(authUser);

      return {
        message: 'User registered successfully',
      };
    } catch (error: any) {
      if (error.code === '23505') {
        throw new RpcException({
          code: Status.ALREADY_EXISTS,
          message: 'User already exists',
        });
      }

      throw new RpcException({
        code: Status.INTERNAL,
        message: 'Internal server error',
      });
    }
  }

  public async login(dto: LoginAuthRequestDto): Promise<LoginAuthResponseDto> {
    const user: AuthUser | null = await this.authUsersRepository.findOneBy({
      username: dto.username,
    });

    if (!user) {
      throw new RpcException({
        code: Status.UNAUTHENTICATED,
        message: 'Invalid credentials',
      });
    }

    const passwordMathes: boolean = await bcrypt.compare(dto.password, user.password!);
    if (!passwordMathes) {
      throw new RpcException({
        code: Status.UNAUTHENTICATED,
        message: 'Invalid credentials',
      });
    }

    const payload: Object = { id: user.id, username: user.username };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
