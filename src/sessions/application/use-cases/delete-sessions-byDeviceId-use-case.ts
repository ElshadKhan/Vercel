import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessionsRepository';
import { DeleteSessionUseCaseDtoType } from '../../domain/dto/deleteSessionUseCaseDtoType';
import { SqlSessionsRepository } from '../../infrastructure/sqlSessionsRepository';

export class DeleteSessionsByDeviceIdCommand {
  constructor(public useCaseDto: DeleteSessionUseCaseDtoType) {}
}

@CommandHandler(DeleteSessionsByDeviceIdCommand)
export class DeleteSessionsByDeviceIdUseCase
  implements ICommandHandler<DeleteSessionsByDeviceIdCommand>
{
  constructor(private sessionsRepository: SqlSessionsRepository) {}

  async execute(command: DeleteSessionsByDeviceIdCommand) {
    return await this.sessionsRepository.deleteSessionsByDeviceId(
      command.useCaseDto.userId,
      command.useCaseDto.deviceId,
    );
  }
}
