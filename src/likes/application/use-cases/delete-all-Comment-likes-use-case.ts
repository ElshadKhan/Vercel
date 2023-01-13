import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../infrastructure/likes.repository';

export class DeleteAllCommentLikesCommand {}

@CommandHandler(DeleteAllCommentLikesCommand)
export class DeleteAllCommentLikesUseCase
  implements ICommandHandler<DeleteAllCommentLikesCommand>
{
  constructor(private likesRepository: LikesRepository) {}

  async execute() {
    return this.likesRepository.deleteAllCommentLikes();
  }
}
