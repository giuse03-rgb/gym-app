import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthServiceController } from './auth-service.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from './database/database.module';
import { AuthUser } from './auth.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([AuthUser]),
  ],
  controllers: [AuthServiceController],
  providers: [AuthService],
})
export class AuthServiceModule {}
