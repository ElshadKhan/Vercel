import { Injectable } from '@nestjs/common';
import { SessionDBType } from '../domain/dto/sessionDbTypeDto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class SqlSessionsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getSession(deviceId: string): Promise<SessionDBType | null> {
    const sessions = await this.dataSource.query(
      `SELECT * FROM "Sessions" WHERE "deviceId" = '${deviceId}'`,
    );
    console.log('Return special ActiveSessions', sessions);

    if (!sessions[0]) return null;

    return {
      ip: sessions[0].ip,
      title: sessions[0].title,
      lastActiveDate: sessions[0].lastActiveDate,
      expiredDate: sessions[0].expiredDate,
      deviceId: sessions[0].deviceId,
      userId: sessions[0].userId,
    };
  }

  async getAllActiveSessions(userId: string): Promise<SessionDBType[]> {
    const sessions = await this.dataSource.query(
      `SELECT * FROM "Sessions" WHERE "userId" = '${userId}'`,
    );
    console.log('Return AllActiveSessions', sessions);

    if (!sessions[0]) return null;

    return sessions.map((ses) => ({
      ip: ses.ip,
      title: ses.title,
      lastActiveDate: ses.lastActiveDate,
      expiredDate: ses.expiredDate,
      deviceId: ses.deviceId,
      userId: ses.userId,
    }));
  }
}
