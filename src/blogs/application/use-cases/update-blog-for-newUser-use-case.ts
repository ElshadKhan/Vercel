import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { IdModelType } from '../../domain/dto/updateBlogsBindType';
import { UsersQueryRepository } from '../../../users/infrastructure/users.queryRepository';
import { UpdateBlogOnNewUserRepo } from '../../domain/dto/updateBlogDbType';
import { BlogsQueryRepository } from '../../infrastructure/blogs.queryRepository';

export class UpdateBlogForNewUserCommand {
  constructor(public inputModel: IdModelType) {}
}

@CommandHandler(UpdateBlogForNewUserCommand)
export class UpdateBlogForNewUserUseCase
  implements ICommandHandler<UpdateBlogForNewUserCommand>
{
  constructor(
    private blogsRepository: BlogsRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(command: UpdateBlogForNewUserCommand) {
    const user = await this.usersQueryRepository.findUserById(
      command.inputModel.userId,
    );
    const updateBlog: UpdateBlogOnNewUserRepo = {
      blogId: command.inputModel.id,
      userId: command.inputModel.userId,
      userLogin: user.accountData.login,
    };
    return this.blogsRepository.updateBlogsOnNewUser(updateBlog);
  }
}
