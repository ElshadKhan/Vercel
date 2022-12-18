import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  async createJWTTokens(userId: string, deviceId: string) {
    const accessToken = jwt.sign(
      { userId: userId },
      this.configService.get<string>('ACCESS_JWT_SECRET'),
      {
        expiresIn: '600sec',
      },
    );
    const refreshToken = jwt.sign(
      {
        userId: userId,
        deviceId: deviceId,
      },
      this.configService.get<string>('REFRESH_JWT_SECRET'),
      { expiresIn: '600sec' },
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async getUserIdByAccessToken(token: string) {
    try {
      const result: any = jwt.verify(
        token,
        this.configService.get<string>('ACCESS_JWT_SECRET'),
      );
      return result.userId;
    } catch (error) {
      return null;
    }
  }

  async getUserIdByRefreshToken(token: string) {
    try {
      const result: any = jwt.verify(
        token,
        this.configService.get<string>('REFRESH_JWT_SECRET'),
      );
      return result;
    } catch (error) {
      return null;
    }
  }
}
