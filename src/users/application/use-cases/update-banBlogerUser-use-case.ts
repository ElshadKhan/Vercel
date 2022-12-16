import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from 'src/users/infrastructure/users.queryRepository';
import { UsersRepository } from 'src/users/infrastructure/users.repository';
import {
  BanBloggerUsersModel,
  BanUsersUseCaseType,
} from 'src/users/api/dto/ban-bloger-users-input-dto';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';

export class UpdateBanBloggerUserCommand {
  constructor(public useCaseDto: BanUsersUseCaseType) {}
}

@CommandHandler(UpdateBanBloggerUserCommand)
export class UpdateBanBloggerUserUseCase
  implements ICommandHandler<UpdateBanBloggerUserCommand>
{
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersRepository: UsersRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute(command: UpdateBanBloggerUserCommand) {
    const user = await this.usersQueryRepository.findUserById(
      command.useCaseDto.banUserId,
    );
    if (!user) return false;
    if (command.useCaseDto.isBanned) {
      const newBanUser = new BanBloggerUsersModel(
        String(+new Date()),
        command.useCaseDto.blogId,
        command.useCaseDto.bloggerId,
        command.useCaseDto.banUserId,
        user.accountData.login,
        {
          isBanned: command.useCaseDto.isBanned,
          banDate: new Date().toISOString(),
          banReason: command.useCaseDto.banReason,
        },
      );
      await this.usersRepository.banBloggerUsers(newBanUser);
      return newBanUser;
    } else {
      await this.usersRepository.unbanBloggerUsers(
        command.useCaseDto.banUserId,
        command.useCaseDto.bloggerId,
      );
      return true;
    }
  }
}
