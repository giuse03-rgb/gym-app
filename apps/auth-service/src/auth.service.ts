import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
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
import { JwtPayload } from 'libs/common/interfaces/jwt-payload';
import { Role } from 'libs/common/enum/roles.enum';

import { AuthUser } from './auth.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(AuthUser) private readonly authUsersRepository: Repository<AuthUser>,
    private readonly jwtService: JwtService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.boostrapAdmin();
  }

  public async register(dto: RegisterAuthRequestDto): Promise<GenericResponseDto> {
    try {
      const hashedPassword: string = await bcrypt.hash(dto.password, 10);

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

    const payload: JwtPayload = { sub: user.id, role: user.role };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  private async boostrapAdmin(): Promise<void> {
    const username: string | undefined = process.env.BOOTSTRAP_ADMIN_USERNAME;
    const password: string | undefined = process.env.BOOTSTRAP_ADMIN_PASSWORD;

    if (!username || !password) {
      return;
    }

    const existingAdmin: AuthUser | null = await this.authUsersRepository.findOneBy({ username });

    if (existingAdmin) {
      this.logger.warn('Boostrap admin already exists, skipping');
      return;
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const admin: AuthUser = this.authUsersRepository.create({
      username,
      password: hashedPassword,
      role: Role.ADMIN,
    });

    await this.authUsersRepository.save(admin);
    this.logger.log('Boostrap admin created successfully');
  }
}
