import { Controller, Get, Param, Delete, Req } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsQueryRepository } from './sessionsQueryRepository';
import { JwtService } from '../auth/application/jwt-service';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private sessionsQueryRepository: SessionsQueryRepository,
    private jwtService: JwtService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsQueryRepository.getSession(id);
  }

  @Delete()
  async deleteAllSessionsExceptOne(@Req() req) {
    const payload = await this.jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken.split(' ')[0],
    );
    return await this.sessionsService.deleteAllSessionsExceptOne(
      payload.userId,
      payload.deviceId,
    );
  }

  @Delete(':id')
  async deleteSessionsByDeviceId(
    @Param('deviceId') deviceId: string,
    @Req() req,
  ) {
    const payload = await this.jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken.split(' ')[0],
    );
    return await this.sessionsService.deleteSessionsByDeviceId(
      payload.userId,
      deviceId,
    );
  }
}
