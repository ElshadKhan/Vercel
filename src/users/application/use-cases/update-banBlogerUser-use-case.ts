import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BanBloggerUsersModel,
  BanUsersUseCaseType,
} from '../../api/dto/ban-bloger-users-input-dto';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UsersQueryRepository } from '../../infrastructure/users.queryRepository';

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
  ) {}

  async execute(command: UpdateBanBloggerUserCommand) {
    const user = await this.usersQueryRepository.findUserById(
      command.useCaseDto.banUserId,
    );
    if (!user) return false;
    if (command.useCaseDto.isBanned) {
      const newBanUser = new BanBloggerUsersModel(
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
