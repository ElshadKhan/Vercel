import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { SqlBlogsRepository } from '../../infrastructure/sql.blogs.repository';

export class DeleteBlogCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsRepository: SqlBlogsRepository) {}

  async execute(command: DeleteBlogCommand) {
    return await this.blogsRepository.delete(command.id);
  }
}
