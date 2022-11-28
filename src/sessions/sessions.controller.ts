import {
  Controller,
  Get,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsQueryRepository } from './sessionsQueryRepository';
import { JwtService } from '../auth/application/jwt-service';
import { RefreshTokenGuard } from '../auth/guards/refresh.token.guard';
import { SessionDBType } from './dto/session.dto';

@Controller('/security/devices')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private sessionsQueryRepository: SessionsQueryRepository,
    private jwtService: JwtService,
  ) {}

  @UseGuards(RefreshTokenGuard)
  @Get()
  async findOne(@Req() req) {
    const result = await this.sessionsQueryRepository.getAllActiveSessions(
      req.user.id,
    );
    return result.map((s: SessionDBType) => ({
      ip: s.ip,
      title: s.title,
      lastActiveDate: s.lastActiveDate,
      deviceId: s.deviceId,
    }));
  }

  @UseGuards(RefreshTokenGuard)
  @Delete()
  @HttpCode(204)
  async deleteAllSessionsExceptOne(@Req() req) {
    const payload = await this.jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken.split(' ')[0],
    );
    return await this.sessionsService.deleteAllSessionsExceptOne(
      payload.userId,
      payload.deviceId,
    );
  }

  @UseGuards(RefreshTokenGuard)
  @Delete(':deviceId')
  @HttpCode(204)
  async deleteSessionsByDeviceId(
    @Param('deviceId') deviceId: string,
    @Req() req,
  ) {
    const payload = await this.jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken.split(' ')[0],
    );
    const comment = await this.sessionsQueryRepository.getSession(deviceId);
    if (!comment) {
      throw new HttpException({}, 404);
    }
    if (comment.userId !== payload.userId) {
      throw new HttpException({}, 403);
    }
    return await this.sessionsService.deleteSessionsByDeviceId(
      payload.userId,
      deviceId,
    );
  }
}
