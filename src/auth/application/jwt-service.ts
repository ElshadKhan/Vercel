import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}
  private accessJwtSecret = this.configService.get<string>('ACCESS_JWT_SECRET');
  private refreshJwtSecret =
    this.configService.get<string>('REFRESH_JWT_SECRET');

  async createJWTTokens(userId: string, deviceId: string) {
    const accessToken = jwt.sign({ userId: userId }, this.accessJwtSecret, {
      expiresIn: '10sec',
    });
    const refreshToken = jwt.sign(
      {
        userId: userId,
        deviceId: deviceId,
      },
      this.refreshJwtSecret,
      { expiresIn: '20sec' },
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async getUserIdByTokenn(token: string) {
    try {
      const result: any = jwt.verify(token, this.JwtSecret);
      return result.userId;
    } catch (error) {
      return null;
    }
  }

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, this.JwtSecret);
      return result;
    } catch (error) {
      return null;
    }
  }
}
