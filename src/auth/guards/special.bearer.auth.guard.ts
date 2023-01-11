import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../../users/infrastructure/users.queryRepository';
import { JwtService } from '../application/jwt-service';
import { SqlUsersQueryRepository } from '../../users/infrastructure/sql.users.queryRepository';

@Injectable()
export class SpecialBearerAuthGuard implements CanActivate {
  constructor(
    private userQueryRepository: SqlUsersQueryRepository,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      return true;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = await this.jwtService.getUserIdByAccessToken(token);
    if (userId) {
      req.user = await this.userQueryRepository.findUserById(userId);
      return true;
    }
    return true;
  }
}
