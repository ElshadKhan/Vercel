import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../infrastructure/likes.repository';

export class DeleteAllPostLikesCommand {}

@CommandHandler(DeleteAllPostLikesCommand)
export class DeleteAllPostLikesUseCase
  implements ICommandHandler<DeleteAllPostLikesCommand>
{
  constructor(private likesRepository: LikesRepository) {}

  async execute() {
    return this.likesRepository.deleteAllPostLikes();
  }
}
