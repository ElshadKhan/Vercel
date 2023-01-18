import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../infrastructure/likes.repository';
import { SqlLikesRepository } from '../../infrastructure/sql.likes.repository';

export class DeleteAllCommentLikesCommand {}

@CommandHandler(DeleteAllCommentLikesCommand)
export class DeleteAllCommentLikesUseCase
  implements ICommandHandler<DeleteAllCommentLikesCommand>
{
  constructor(private likesRepository: SqlLikesRepository) {}

  async execute() {
    return this.likesRepository.deleteAllCommentLikes();
  }
}
