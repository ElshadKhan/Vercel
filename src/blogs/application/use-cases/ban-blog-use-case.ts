import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import {
  BanBlogsFactory,
  BanBlogUseCaseDto,
} from '../../domain/dto/updateBlogsBindType';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { SqlBlogsRepository } from '../../infrastructure/sql.blogs.repository';
import { SqlPostsRepository } from '../../../posts/infrastructure/sql.posts.repository';

export class BanBlogCommand {
  constructor(public banBlogUseCaseDto: BanBlogUseCaseDto) {}
}

@CommandHandler(BanBlogCommand)
export class BanBlogUseCase implements ICommandHandler<BanBlogCommand> {
  constructor(
    private blogsRepository: SqlBlogsRepository,
    private postsRepository: SqlPostsRepository,
  ) {}

  async execute(command: BanBlogCommand) {
    const banBlogDto = new BanBlogsFactory(
      command.banBlogUseCaseDto.blogId,
      command.banBlogUseCaseDto.isBanned,
      new Date().toISOString(),
    );
    await this.blogsRepository.banBlogs(banBlogDto);
    await this.postsRepository.banBlogs(banBlogDto.blogId, banBlogDto.isBanned);
    return;
  }
}
