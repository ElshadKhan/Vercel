import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../../users/users.queryRepository';
import { JwtService } from '../application/jwt-service';

@Injectable()
export class BearerRegistrationGuard implements CanActivate {
  constructor(
    private userQueryRepository: UsersQueryRepository,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      throw new UnauthorizedException();
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = await this.jwtService.getUserIdByAccessToken(token);
    if (userId) {
      req.user = await this.userQueryRepository.getUser(userId);
      return true;
    }
    throw new BadRequestException();
  }
}
