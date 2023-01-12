import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessionsRepository';
import { SqlSessionsRepository } from '../../infrastructure/sqlSessionsRepository';

export class DeleteAllUserSessionsCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteAllUserSessionsCommand)
export class DeleteAllUserSessionsUseCase
  implements ICommandHandler<DeleteAllUserSessionsCommand>
{
  constructor(private sessionsRepository: SqlSessionsRepository) {}

  async execute(command: DeleteAllUserSessionsCommand) {
    return await this.sessionsRepository.deleteUserDevices(command.userId);
  }
}
