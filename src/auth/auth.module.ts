import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './api/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BasicStrategy } from './strategies/basic.strategy';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, BasicStrategy],
  exports: [AuthService],
})
export class AuthModule {}
