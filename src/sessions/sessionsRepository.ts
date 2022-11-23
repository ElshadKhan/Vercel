import { Injectable } from '@nestjs/common';
import { SessionDBType } from './dto/session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDbTypeWithId } from './entities/session.entity';

@Injectable()
export class SessionsRepository {
  @InjectModel(Session.name) private sessionModel: Model<SessionDbTypeWithId>;

  async createSession(session: SessionDBType): Promise<SessionDBType> {
    await this.sessionModel.create(session);
    return session;
  }

  async updateSessions(
    userId: string,
    deviceId: string,
    lastActiveDate: string,
  ) {
    const sessions = await this.sessionModel.updateOne(
      {
        userId: userId,
        deviceId: deviceId,
      },
      { $set: { lastActiveDate: lastActiveDate } },
    );
    return sessions.modifiedCount === 1;
  }

  async deleteAllSessions() {
    const result = await this.sessionModel.deleteMany({});
    return result.deletedCount === 1;
  }

  async deleteSessionsByDeviceId(userId: string, deviceId: string) {
    const result = await this.sessionModel.deleteMany({
      userId: userId,
      deviceId: deviceId,
    });
    return result.deletedCount === 1;
  }

  async deleteAllSessionsExceptOne(userId: string, deviceId: string) {
    const result = await this.sessionModel.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return result.deletedCount === 1;
  }
}
