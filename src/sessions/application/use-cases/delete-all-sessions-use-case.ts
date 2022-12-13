import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessionsRepository';

export class DeleteAllSessionsCommand {}

@CommandHandler(DeleteAllSessionsCommand)
export class DeleteAllSessionsUseCase
  implements ICommandHandler<DeleteAllSessionsCommand>
{
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute() {
    return await this.sessionsRepository.deleteAll();
  }
}
