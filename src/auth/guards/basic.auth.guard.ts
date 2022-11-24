import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const template = 'admin:qwerty';
    const authHeader = req.headers.authorization;
    const base64Data = Buffer.from(template);
    const base64String = base64Data.toString('base64');
    const validAuthHeader = `Basic ${base64String}`;

    if (!authHeader || authHeader !== validAuthHeader) {
      throw new UnauthorizedException();
    } else {
      return true;
    }
  }
}
