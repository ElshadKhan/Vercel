import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../../users/users.queryRepository';
import { JwtService } from '../application/jwt-service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private userQueryRepository: UsersQueryRepository,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const refToken = req.cookies.refreshToken;
    if (!refToken) {
      res.send(401);
      return;
    }
    const token = refToken.split(' ')[0];
    const user = await this.jwtService.getUserIdByRefreshToken(token);
    if (!user) {
      throw new UnauthorizedException();
    }
    const findRefToken = await sessionsRepository.getSession(user.deviceId);
    if (
      !findRefToken ||
      findRefToken.lastActiveDate !== new Date(user.iat * 1000).toISOString()
    ) {
      throw new UnauthorizedException();
    }
    req.user = await this.userQueryRepository.getUser(user.userId);
    return true;
  }
}
