import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { SessionDBType } from '../../domain/dto/sessionDbTypeDto';
import { SessionsRepository } from '../../infrastructure/sessionsRepository';
import { CreateSessionUseCaseDtoType } from '../../domain/dto/createSessionUseCaseDtoType';
import { JwtService } from '../../../auth/application/jwt-service';
import { SqlSessionsRepository } from '../../infrastructure/sqlSessionsRepository';

export class CreateSessionCommand {
  constructor(public useCaseDto: CreateSessionUseCaseDtoType) {}
}

@CommandHandler(CreateSessionCommand)
export class CreateSessionUseCase
  implements ICommandHandler<CreateSessionCommand>
{
  constructor(
    private jwtService: JwtService,
    private sessionsRepository: SqlSessionsRepository,
  ) {}

  async execute(command: CreateSessionCommand) {
    const deviceId = randomUUID();
    const tokens = await this.jwtService.createJWTTokens(
      command.useCaseDto.userId,
      deviceId,
    );
    const payload = await this.jwtService.getUserIdByRefreshToken(
      tokens.refreshToken,
    );

    const session: SessionDBType = {
      ip: command.useCaseDto.ip,
      title: command.useCaseDto.deviceName,
      lastActiveDate: new Date(payload.iat * 1000).toISOString(),
      expiredDate: new Date(payload.exp * 1000).toISOString(),
      deviceId: deviceId,
      userId: command.useCaseDto.userId,
    };
    await this.sessionsRepository.createSession(session);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
