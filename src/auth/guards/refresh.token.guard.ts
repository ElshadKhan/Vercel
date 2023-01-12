import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../../users/infrastructure/users.queryRepository';
import { JwtService } from '../application/jwt-service';
import { SessionsQueryRepository } from '../../sessions/infrastructure/sessionsQueryRepository';
import { SqlUsersQueryRepository } from '../../users/infrastructure/sql.users.queryRepository';
import { SqlSessionsQueryRepository } from '../../sessions/infrastructure/sqlSessionsQueryRepository';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private userQueryRepository: SqlUsersQueryRepository,
    private sessionsQueryRepository: SqlSessionsQueryRepository,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const refToken = req.cookies.refreshToken;
    if (!refToken) {
      throw new UnauthorizedException();
    }
    const token = refToken.split(' ')[0];
    const user = await this.jwtService.getUserIdByRefreshToken(token);
    if (!user) {
      throw new UnauthorizedException();
    }
    const findRefToken = await this.sessionsQueryRepository.getSession(
      user.deviceId,
    );
    if (
      !findRefToken ||
      findRefToken.lastActiveDate !== new Date(user.iat * 1000).toISOString()
    ) {
      throw new UnauthorizedException();
    }
    req.user = await this.userQueryRepository.findUserById(user.userId);
    return true;
  }
}
