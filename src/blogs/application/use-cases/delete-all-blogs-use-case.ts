import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class DeleteAllBlogsCommand {}

@CommandHandler(DeleteAllBlogsCommand)
export class DeleteAllBlogsUseCase
  implements ICommandHandler<DeleteAllBlogsCommand>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute() {
    return await this.blogsRepository.deleteAll();
  }
}
