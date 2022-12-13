import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from '../../infrastructure/likes.repository';

export class DeleteAllLikesCommand {}

@CommandHandler(DeleteAllLikesCommand)
export class DeleteAllLikesUseCase
  implements ICommandHandler<DeleteAllLikesCommand>
{
  constructor(private likesRepository: LikesRepository) {}

  async execute() {
    return this.likesRepository.deleteAll();
  }
}
