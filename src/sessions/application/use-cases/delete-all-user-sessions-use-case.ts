import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessionsRepository';

export class DeleteAllUserSessionsCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteAllUserSessionsCommand)
export class DeleteAllUserSessionsUseCase
  implements ICommandHandler<DeleteAllUserSessionsCommand>
{
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: DeleteAllUserSessionsCommand) {
    return await this.sessionsRepository.deleteUserDevices(command.userId);
  }
}
