import { Injectable } from '@nestjs/common';
import { SessionDBType } from '../domain/dto/sessionDbTypeDto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class SqlSessionsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createSession(session: SessionDBType): Promise<SessionDBType> {
    await this.dataSource.query(
      `INSERT INTO "Sessions"("userId", "deviceId", "ip", "title", "lastActiveDate", "expiredDate") 
VALUES ('${session.userId}', '${session.deviceId}', '${session.ip}', '${session.title}', '${session.lastActiveDate}', '${session.expiredDate}')`,
    );
    return session;
  }

  async updateSessions(
    userId: string,
    deviceId: string,
    lastActiveDate: string,
  ) {
    const result = await this.dataSource.query(`UPDATE "Sessions"
    SET "lastActiveDate" = '${lastActiveDate}'
    WHERE "userId" = '${userId}'
    AND "deviceId" = '${deviceId}'`);
    console.log('Update SessionsResult', result);
    return true;
  }

  async deleteAll() {
    const result = await this.dataSource.query(`DELETE FROM "Sessions"`);
    console.log('Delete AllSessionsResult', result);
    return true;
  }

  async deleteUserDevices(userId: string) {
    const result = await this.dataSource.query(
      `DELETE FROM "Sessions" WHERE "userId" = '${userId}'`,
    );
    console.log('Delete AllSessionsResult by Id result', result);
    return true;
  }

  async deleteSessionsByDeviceId(userId: string, deviceId: string) {
    const result = await this.dataSource.query(`DELETE FROM "Sessions"
WHERE "userId" = '${userId}'
AND "deviceId" = '${deviceId}`);
    console.log('Delete AllSessions special deviceId result', result);
    return true;
  }

  async deleteAllSessionsExceptOne(userId: string, deviceId: string) {
    const result = await this.dataSource.query(`DELETE FROM "Sessions"
WHERE "userId" = '${userId}'
AND NOT"deviceId" = '${deviceId}'`);
    console.log('Delete AllSessionsResult by Id except 1 result', result);
    return true;
  }
}
