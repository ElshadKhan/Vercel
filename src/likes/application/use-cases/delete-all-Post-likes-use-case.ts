import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../infrastructure/likes.repository';
import { SqlLikesRepository } from '../../infrastructure/sql.likes.repository';

export class DeleteAllPostLikesCommand {}

@CommandHandler(DeleteAllPostLikesCommand)
export class DeleteAllPostLikesUseCase
  implements ICommandHandler<DeleteAllPostLikesCommand>
{
  constructor(private likesRepository: SqlLikesRepository) {}

  async execute() {
    return this.likesRepository.deleteAllPostLikes();
  }
}
