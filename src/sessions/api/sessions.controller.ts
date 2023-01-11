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
import { SessionsQueryRepository } from '../infrastructure/sessionsQueryRepository';
import { JwtService } from '../../auth/application/jwt-service';
import { RefreshTokenGuard } from '../../auth/guards/refresh.token.guard';
import { SessionDBType } from '../domain/dto/sessionDbTypeDto';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteSessionsByDeviceIdCommand } from '../application/use-cases/delete-sessions-byDeviceId-use-case';
import { DeleteSessionUseCaseDtoType } from '../domain/dto/deleteSessionUseCaseDtoType';
import { DeleteAllSessionsExceptOneCommand } from '../application/use-cases/delete-all-sessions-exceptOne-use-case';

@Controller('/security/devices')
export class SessionsController {
  constructor(
    private commandBus: CommandBus,
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
    const useCaseDto: DeleteSessionUseCaseDtoType = {
      userId: payload.userId,
      deviceId: payload.deviceId,
    };
    return await this.commandBus.execute(
      new DeleteAllSessionsExceptOneCommand(useCaseDto),
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
    const useCaseDto: DeleteSessionUseCaseDtoType = {
      userId: payload.userId,
      deviceId: deviceId,
    };
    return await this.commandBus.execute(
      new DeleteSessionsByDeviceIdCommand(useCaseDto),
    );
  }
}
