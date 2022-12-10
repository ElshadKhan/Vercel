import { Injectable } from '@nestjs/common';
import { SessionsRepository } from '../infrastructure/sessionsRepository';
import { UserAccountDBType } from '../../users/domain/dto/user.account.dto';
import { SessionDBType } from '../domain/dto/sessionDbTypeDto';
import { randomUUID } from 'crypto';
import { SessionsQueryRepository } from '../infrastructure/sessionsQueryRepository';
import { JwtService } from '../../auth/application/jwt-service';

@Injectable()
export class SessionsService {
  constructor(
    private sessionsRepository: SessionsRepository,
    private sessionsQueryRepository: SessionsQueryRepository,
    private jwtService: JwtService,
  ) {}

  async createSession(userId: string, ip: string, deviceName: string) {
    const deviceId = randomUUID();
    const tokens = await this.jwtService.createJWTTokens(userId, deviceId);
    const payload = await this.jwtService.getUserIdByRefreshToken(
      tokens.refreshToken,
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
