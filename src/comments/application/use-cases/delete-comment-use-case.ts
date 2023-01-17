import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { SqlCommentsRepository } from '../../infrastructure/sql.comments.repository';

export class DeleteCommentCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private commentsRepository: SqlCommentsRepository) {}

  async execute(command: DeleteCommentCommand) {
    return await this.commentsRepository.delete(command.id);
  }
}
