import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsQueryRepository } from './sessionsQueryRepository';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private sessionsQueryRepository: SessionsQueryRepository,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsQueryRepository.getSession(id);
  }

  @Delete()
  async deleteAllSessionsExceptOne() {
    const payload = await this.jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken.split(' ')[0],
    );
    return await this.sessionsService.deleteAllSessionsExceptOne(
      payload.userId,
      payload.deviceId,
    );
  }

  @Delete(':id')
  async deleteSessionsByDeviceId(@Param('deviceId') deviceId: string) {
    const payload = await this.jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken.split(' ')[0],
    );
    return await this.sessionsService.deleteSessionsByDeviceId(
      payload.userId,
      deviceId,
    );
  }
}
