import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessionsRepository';
import { UpdateSessionUseCaseDtoType } from '../../domain/dto/updateSessionUseCaseDtoType';
import { SqlSessionsRepository } from '../../infrastructure/sqlSessionsRepository';

export class UpdateSessionCommand {
  constructor(public useCaseDto: UpdateSessionUseCaseDtoType) {}
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionUseCase
  implements ICommandHandler<UpdateSessionCommand>
{
  constructor(private sessionsRepository: SqlSessionsRepository) {}

  async execute(command: UpdateSessionCommand) {
    return await this.sessionsRepository.updateSessions(
      command.useCaseDto.userId,
      command.useCaseDto.deviceId,
      command.useCaseDto.lastActiveDate,
    );
  }
}
