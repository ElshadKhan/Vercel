import { Injectable } from '@nestjs/common';
import { SessionDBType, SessionType } from './dto/session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionDbTypeWithId } from './entities/session.entity';
import { Model } from 'mongoose';

@Injectable()
export class SessionsQueryRepository {
  @InjectModel(Session.name) private sessionModel: Model<SessionDbTypeWithId>;

  async getSession(deviceId: string): Promise<SessionDBType | null> {
    return await this.sessionModel.findOne({ deviceId: deviceId });
  }

  async getAllActiveSessions(userId: string): Promise<SessionType[]> {
    const sessions = await this.sessionModel
      .find({ userId: userId })
      .projection({
        _id: 0,
        ip: 1,
        title: 1,
        lastActiveDate: 1,
        deviceId: 1,
      })
      .toArray();
    return sessions as SessionType[];
  }
}
