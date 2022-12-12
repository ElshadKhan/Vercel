import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class DeleteAllCommentsCommand {}

@CommandHandler(DeleteAllCommentsCommand)
export class DeleteAllCommentsUseCase
  implements ICommandHandler<DeleteAllCommentsCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute() {
    return await this.commentsRepository.deleteAll();
  }
}
