import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BanBloggerUsersModel,
  BanUsersUseCaseType,
} from '../../api/dto/ban-bloger-users-input-dto';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UsersQueryRepository } from '../../infrastructure/users.queryRepository';
import { SqlUsersQueryRepository } from '../../infrastructure/sql.users.queryRepository';
import { SqlUsersRepository } from '../../infrastructure/sql.users.repository';

export class UpdateBanBloggerUserCommand {
  constructor(public useCaseDto: BanUsersUseCaseType) {}
}

@CommandHandler(UpdateBanBloggerUserCommand)
export class UpdateBanBloggerUserUseCase
  implements ICommandHandler<UpdateBanBloggerUserCommand>
{
  constructor(
    private usersQueryRepository: SqlUsersQueryRepository,
    private usersRepository: SqlUsersRepository,
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
        command.useCaseDto.blogId,
      );
      return true;
    }
  }
}
