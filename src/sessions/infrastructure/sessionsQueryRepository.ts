import { Injectable } from '@nestjs/common';
import { SessionDBType } from '../domain/dto/sessionDbTypeDto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Session,
  SessionDbTypeWithId,
} from '../domain/entities/NO_SQL_entities/session.entity';
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
