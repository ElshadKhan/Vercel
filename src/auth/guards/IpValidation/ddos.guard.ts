import {
  Injectable,
  CanActivate,
  ExecutionContext,
  RequestTimeoutException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ip, IpDbType } from './ip.entity';

@Injectable()
export class DdosGuard implements CanActivate {
  @InjectModel(Ip.name) private ipModel: Model<IpDbType>;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const blockedInterval = 10000;
    const connectionAt = +new Date();
    const ip = req.ip;
    const endpoint = req.url;

    const isBlocked = await this.ipModel.findOne({
      ip,
      endpoint,
      isBlocked: true,
      blockedDate: { $gte: connectionAt - blockedInterval },
    });
    if (isBlocked) throw new RequestTimeoutException(429);
    const connectionsCount = await this.ipModel.countDocuments({
      ip,
      endpoint,
      connectionAt: { $gte: connectionAt - blockedInterval },
    });

    if (connectionsCount + 1 > 5) {
      await this.ipModel.updateOne(
        { ip, endpoint },
        { $set: { isBlocked: true, blockedDate: connectionAt } },
      );

      throw new RequestTimeoutException(429);
    }

    await this.ipModel.create({
      ip,
      endpoint,
      connectionAt,
      isBlocked: false,
      blockedDate: null,
    });

    return true;
  }
}
