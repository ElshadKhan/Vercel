import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { UpdatePostUseCaseDto } from '../dto/createPostUseCaseDto';
import { SqlPostsRepository } from '../../infrastructure/sql.posts.repository';

export class UpdatePostCommand {
  constructor(public useCaseDto: UpdatePostUseCaseDto) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(private postsRepository: SqlPostsRepository) {}

  async execute(command: UpdatePostCommand) {
    return await this.postsRepository.update(
      command.useCaseDto.postId,
      command.useCaseDto.title,
      command.useCaseDto.shortDescription,
      command.useCaseDto.content,
      command.useCaseDto.blogId,
    );
  }
}
