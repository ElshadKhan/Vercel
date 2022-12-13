import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessionsRepository';
import { DeleteSessionUseCaseDtoType } from '../../domain/dto/deleteSessionUseCaseDtoType';

export class DeleteAllSessionsExceptOneCommand {
  constructor(public useCaseDto: DeleteSessionUseCaseDtoType) {}
}

@CommandHandler(DeleteAllSessionsExceptOneCommand)
export class DeleteAllSessionsExceptOneUseCase
  implements ICommandHandler<DeleteAllSessionsExceptOneCommand>
{
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: DeleteAllSessionsExceptOneCommand) {
    return await this.sessionsRepository.deleteAllSessionsExceptOne(
      command.useCaseDto.userId,
      command.useCaseDto.deviceId,
    );
  }
}
