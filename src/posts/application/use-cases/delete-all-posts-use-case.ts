import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class DeleteAllPostsCommand {}

@CommandHandler(DeleteAllPostsCommand)
export class DeleteAllPostsUseCase
  implements ICommandHandler<DeleteAllPostsCommand>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute() {
    return await this.postsRepository.deleteAll();
  }
}
