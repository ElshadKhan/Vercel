import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionsRepository {
  async getSession(deviceId: string): Promise<SessionDBType | null> {
    return await SessionModelClass.findOne({ deviceId: deviceId });
  }

  async getAllActiveSessions(userId: string): Promise<SessionType[]> {
    const sessions = await SessionModelClass.find({ userId: userId })
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

  async createSession(session: SessionDBType): Promise<SessionDBType> {
    await SessionModelClass.create(session);
    return session;
  }

  async updateSessions(
    userId: string,
    deviceId: string,
    lastActiveDate: string,
  ) {
    const sessions = await SessionModelClass.updateOne(
      {
        userId: userId,
        deviceId: deviceId,
      },
      { $set: { lastActiveDate: lastActiveDate } },
    );
    return sessions.modifiedCount === 1;
  }

  async deleteAllSessions() {
    const result = await SessionModelClass.deleteMany({});
    return result.deletedCount === 1;
  }

  async deleteSessionsByDeviceId(userId: string, deviceId: string) {
    const result = await SessionModelClass.deleteMany({
      userId: userId,
      deviceId: deviceId,
    });
    return result.deletedCount === 1;
  }

  async deleteAllSessionsExceptOne(userId: string, deviceId: string) {
    const result = await SessionModelClass.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return result.deletedCount === 1;
  }
}
