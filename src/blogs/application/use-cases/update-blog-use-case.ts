import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { UpdateBlogDbType } from '../../domain/dto/updateBlogDbType';
import { SqlBlogsRepository } from '../../infrastructure/sql.blogs.repository';

export class UpdateBlogCommand {
  constructor(public updateDto: UpdateBlogDbType) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogsRepository: SqlBlogsRepository) {}

  async execute(command: UpdateBlogCommand) {
    return await this.blogsRepository.update(
      command.updateDto.id,
      command.updateDto.name,
      command.updateDto.description,
      command.updateDto.websiteUrl,
    );
  }
}
