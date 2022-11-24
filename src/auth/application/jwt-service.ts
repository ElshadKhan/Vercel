import jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UserAccountDBType } from '../../users/dto/user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}
  private accessTokenJwtSecret = this.configService.get<string>(
    'ACCESS_JWT_TOKEN_SECRET',
  );
  private refreshTokenJwtSecret = this.configService.get<string>(
    'REFRESH_JWT_TOKEN_SECRET',
  );
  async createJWTTokens(user: UserAccountDBType, deviceId: string) {
    const accessToken = jwt.sign(
      { userId: user.id },
      this.accessTokenJwtSecret,
      { expiresIn: '500sec' },
    );
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        deviceId: deviceId,
      },
      this.refreshTokenJwtSecret,
      { expiresIn: '500sec' },
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async getUserIdByAccessToken(token: string) {
    try {
      const result: any = jwt.verify(token, this.accessTokenJwtSecret);
      return result.userId;
    } catch (error) {
      return null;
    }
  }

  async getUserIdByRefreshToken(token: string) {
    try {
      const result: any = jwt.verify(token, this.refreshTokenJwtSecret);
      return result;
    } catch (error) {
      return null;
    }
  }
}
