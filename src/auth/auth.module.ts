import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './api/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
