import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogDto } from '../../domain/dto/createBlogDto';
import { CreateBlogDbType } from '../../domain/dto/createBlogDbType';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class CreateBlogCommand {
  constructor(public createBlogDto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: CreateBlogCommand) {
    const newBlog = new CreateBlogDbType(
      String(+new Date()),
      command.createBlogDto.name,
      command.createBlogDto.description,
      command.createBlogDto.websiteUrl,
      new Date().toISOString(),
    );
    await this.blogsRepository.create(newBlog);
    return newBlog;
  }
}
