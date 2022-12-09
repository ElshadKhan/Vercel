import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}
  private JwtSecret = this.configService.get<string>('JWT_SECRET');

  async createJWTTokens(userId: string, deviceId: string) {
    const accessToken = jwt.sign({ userId: userId }, this.JwtSecret, {
      expiresIn: '10sec',
    });
    const refreshToken = jwt.sign(
      {
        userId: userId,
        deviceId: deviceId,
      },
      this.JwtSecret,
      { expiresIn: '20sec' },
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
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
