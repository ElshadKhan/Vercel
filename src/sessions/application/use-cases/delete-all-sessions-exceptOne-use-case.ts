import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessionsRepository';
import { DeleteSessionUseCaseDtoType } from '../../domain/dto/deleteSessionUseCaseDtoType';
import { SqlSessionsRepository } from '../../infrastructure/sqlSessionsRepository';

export class DeleteAllSessionsExceptOneCommand {
  constructor(public useCaseDto: DeleteSessionUseCaseDtoType) {}
}

@CommandHandler(DeleteAllSessionsExceptOneCommand)
export class DeleteAllSessionsExceptOneUseCase
  implements ICommandHandler<DeleteAllSessionsExceptOneCommand>
{
  constructor(private sessionsRepository: SqlSessionsRepository) {}

  async execute(command: DeleteAllSessionsExceptOneCommand) {
    return await this.sessionsRepository.deleteAllSessionsExceptOne(
      command.useCaseDto.userId,
      command.useCaseDto.deviceId,
    );
  }
}
