import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { SqlCommentsRepository } from '../../infrastructure/sql.comments.repository';

export class DeleteAllCommentsCommand {}

@CommandHandler(DeleteAllCommentsCommand)
export class DeleteAllCommentsUseCase
  implements ICommandHandler<DeleteAllCommentsCommand>
{
  constructor(private commentsRepository: SqlCommentsRepository) {}

  async execute() {
    return await this.commentsRepository.deleteAll();
  }
}
