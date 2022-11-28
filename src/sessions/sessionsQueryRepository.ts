import { Injectable } from '@nestjs/common';
import { SessionDBType } from './dto/session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionDbTypeWithId } from './entities/session.entity';
import { Model } from 'mongoose';

@Injectable()
export class SessionsQueryRepository {
  @InjectModel(Session.name) private sessionModel: Model<SessionDbTypeWithId>;

  async getSession(deviceId: string): Promise<SessionDBType | null> {
    return await this.sessionModel.findOne({ deviceId: deviceId });
  }

  async getAllActiveSessions(userId: string): Promise<SessionDBType[]> {
    const sessions = await this.sessionModel.find({ userId }).lean();
    return sessions;
  }
}
