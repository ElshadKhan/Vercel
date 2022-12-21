import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAllUserSessionsCommand } from '../../../sessions/application/use-cases/delete-all-user-sessions-use-case';
import { UsersRepository } from '../../infrastructure/users.repository';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import {
  BanUserInputUseCaseType,
  BanUsersFactory,
} from '../../api/dto/update-user-banStatus-dto';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { CommentsRepository } from '../../../comments/infrastructure/comments.repository';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';

export class UpdateUserCommand {
  constructor(public inputModel: BanUserInputUseCaseType) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserUseCase implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private commandBus: CommandBus,
    private userRepository: UsersRepository,
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
    private commentsRepository: CommentsRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute(command: UpdateUserCommand) {
    if (command.inputModel.isBanned) {
      const banInfo = new BanUsersFactory(
        command.inputModel.id,
        command.inputModel.isBanned,
        new Date().toISOString(),
        command.inputModel.banReason,
      );

      await this.commandBus.execute(
        new DeleteAllUserSessionsCommand(banInfo.id),
      );
      await this.userRepository.updateUsers(banInfo);

      await this.blogsRepository.banUsers(
        banInfo.id,
        command.inputModel.isBanned,
        banInfo.banDate,
      );
      await this.postsRepository.banUsers(
        banInfo.id,
        command.inputModel.isBanned,
      );
      await this.commentsRepository.banUsers(
        banInfo.id,
        command.inputModel.isBanned,
      );
      await this.likesRepository.banUsers(
        banInfo.id,
        command.inputModel.isBanned,
      );

      return banInfo;
    } else {
      const banInfo = new BanUsersFactory(
        command.inputModel.id,
        command.inputModel.isBanned,
        null,
        null,
      );

      await this.userRepository.updateUsers(banInfo);

      await this.blogsRepository.banUsers(
        banInfo.id,
        command.inputModel.isBanned,
        banInfo.banDate,
      );
      await this.postsRepository.banUsers(
        banInfo.id,
        command.inputModel.isBanned,
      );
      await this.commentsRepository.banUsers(
        banInfo.id,
        command.inputModel.isBanned,
      );
      await this.likesRepository.banUsers(
        banInfo.id,
        command.inputModel.isBanned,
      );

      return banInfo;
    }
  }
}
