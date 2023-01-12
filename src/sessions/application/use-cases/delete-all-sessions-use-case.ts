import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsRepository } from '../../infrastructure/sessionsRepository';
import { SqlSessionsRepository } from '../../infrastructure/sqlSessionsRepository';

export class DeleteAllSessionsCommand {}

@CommandHandler(DeleteAllSessionsCommand)
export class DeleteAllSessionsUseCase
  implements ICommandHandler<DeleteAllSessionsCommand>
{
  constructor(private sessionsRepository: SqlSessionsRepository) {}

  async execute() {
    return await this.sessionsRepository.deleteAll();
  }
}
