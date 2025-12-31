import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';

import * as bcrypt from 'bcrypt';
import { status as Status } from '@grpc/grpc-js';
import { Repository } from 'typeorm';

import { GenericResponseDto } from 'libs/common/dto/generic-response.dto';
import { RegisterAuthRequestDto } from 'libs/common/dto/register.dto';

import { AuthUser } from './auth.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(AuthUser) private readonly authUsersRepository: Repository<AuthUser>,
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
      this.logger.error(error);

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
}
