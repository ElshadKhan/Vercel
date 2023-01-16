import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBlogUseCaseDto } from '../../domain/dto/createBlogDto';
import { CreateBlogDbType } from '../../domain/dto/createBlogDbType';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { UsersQueryRepository } from '../../../users/infrastructure/users.queryRepository';
import { SqlUsersQueryRepository } from '../../../users/infrastructure/sql.users.queryRepository';
import { SqlBlogsRepository } from '../../infrastructure/sql.blogs.repository';

export class CreateBlogCommand {
  constructor(public createUseCaseDto: CreateBlogUseCaseDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private blogsRepository: SqlBlogsRepository,
    private usersQueryRepository: SqlUsersQueryRepository,
  ) {}

  async execute(command: CreateBlogCommand) {
    const user = await this.usersQueryRepository.findUserById(
      command.createUseCaseDto.userId,
    );
    const newBlog = new CreateBlogDbType(
      String(+new Date()),
      command.createUseCaseDto.name,
      command.createUseCaseDto.description,
      command.createUseCaseDto.websiteUrl,
      new Date().toISOString(),
      {
        userId: command.createUseCaseDto.userId,
        userLogin: user.accountData.login,
      },
      {
        isBanned: false,
        banDate: null,
      },
    );
    await this.blogsRepository.create(newBlog);
    return newBlog;
  }
}
