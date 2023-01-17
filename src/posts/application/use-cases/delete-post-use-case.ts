import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { SqlPostsRepository } from '../../infrastructure/sql.posts.repository';

export class DeletePostCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private postsRepository: SqlPostsRepository) {}

  async execute(command: DeletePostCommand) {
    return await this.postsRepository.delete(command.id);
  }
}
