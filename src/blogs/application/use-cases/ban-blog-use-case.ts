import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import {
  BanBlogsFactory,
  BanBlogUseCaseDto,
} from '../../domain/dto/updateBlogsBindType';

export class BanBlogCommand {
  constructor(public banBlogUseCaseDto: BanBlogUseCaseDto) {}
}

@CommandHandler(BanBlogCommand)
export class BanBlogUseCase implements ICommandHandler<BanBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: BanBlogCommand) {
    const banBlogDto = new BanBlogsFactory(
      command.banBlogUseCaseDto.blogId,
      command.banBlogUseCaseDto.isBanned,
      new Date().toISOString(),
    );
    return await this.blogsRepository.banBlogs(banBlogDto);
  }
}
