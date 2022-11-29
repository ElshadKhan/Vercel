import { Injectable } from '@nestjs/common';
import { SessionsRepository } from './sessionsRepository';
import { UserAccountDBType } from '../users/dto/user.dto';
import { SessionDBType } from './dto/session.dto';
import { randomUUID } from 'crypto';
import { SessionsQueryRepository } from './sessionsQueryRepository';
import { JwtService } from '../auth/application/jwt-service';

@Injectable()
export class SessionsService {
  constructor(
    private sessionsRepository: SessionsRepository,
    private sessionsQueryRepository: SessionsQueryRepository,
    private jwtService: JwtService,
  ) {}

  async createSession(user: UserAccountDBType, ip: string, deviceName: string) {
    const userId = user.id;
    const deviceId = String(randomUUID());
    const tokens = await this.jwtService.createJWTTokens(user, deviceId);
    const payload = await this.jwtService.getUserIdByRefreshToken(
      tokens.refreshToken.split(' ')[0],
    );
    const session: SessionDBType = {
      ip: ip,
      title: deviceName,
      lastActiveDate: new Date(payload.iat * 1000).toISOString(),
      expiredDate: new Date(payload.exp * 1000).toISOString(),
      deviceId: deviceId,
      userId: userId,
    };
    await this.sessionsRepository.createSession(session);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async updateSession(
    userId: string,
    deviceId: string,
    lastActiveDate: string,
  ) {
    return await this.sessionsRepository.updateSessions(
      userId,
      deviceId,
      lastActiveDate,
    );
  }

  async deleteAll() {
    return await this.sessionsRepository.deleteAll();
  }

  async deleteSessionsByDeviceId(userId: string, deviceId: string) {
    return await this.sessionsRepository.deleteSessionsByDeviceId(
      userId,
      deviceId,
    );
  }

  async deleteAllSessionsExceptOne(userId: string, deviceId: string) {
    return await this.sessionsRepository.deleteAllSessionsExceptOne(
      userId,
      deviceId,
    );
  }
}
