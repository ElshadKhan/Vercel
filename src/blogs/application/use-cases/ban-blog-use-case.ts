import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import {
  BanBlogsFactory,
  BanBlogUseCaseDto,
} from '../../domain/dto/updateBlogsBindType';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';

export class BanBlogCommand {
  constructor(public banBlogUseCaseDto: BanBlogUseCaseDto) {}
}

@CommandHandler(BanBlogCommand)
export class BanBlogUseCase implements ICommandHandler<BanBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: BanBlogCommand) {
    let banDate = null;
    if (command.banBlogUseCaseDto.isBanned) {
      banDate = new Date().toISOString();
    }
    const banBlogDto = new BanBlogsFactory(
      command.banBlogUseCaseDto.blogId,
      command.banBlogUseCaseDto.isBanned,
      banDate,
    );
    await this.blogsRepository.banBlogs(banBlogDto);
    await this.postsRepository.banBlogs(banBlogDto.blogId, banBlogDto.isBanned);
    return;
  }
}
