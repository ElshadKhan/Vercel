import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessionsRepository';
import { UpdateSessionUseCaseDtoType } from '../../domain/dto/updateSessionUseCaseDtoType';

export class UpdateSessionCommand {
  constructor(public useCaseDto: UpdateSessionUseCaseDtoType) {}
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionUseCase
  implements ICommandHandler<UpdateSessionCommand>
{
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: UpdateSessionCommand) {
    return await this.sessionsRepository.updateSessions(
      command.useCaseDto.userId,
      command.useCaseDto.deviceId,
      command.useCaseDto.lastActiveDate,
    );
  }
}
