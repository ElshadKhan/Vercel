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
import { SqlUsersRepository } from '../../infrastructure/sql.users.repository';
import { SqlBlogsRepository } from '../../../blogs/infrastructure/sql.blogs.repository';
import { SqlPostsRepository } from '../../../posts/infrastructure/sql.posts.repository';
import { SqlCommentsRepository } from '../../../comments/infrastructure/sql.comments.repository';
import { SqlLikesRepository } from '../../../likes/infrastructure/sql.likes.repository';

export class UpdateUserCommand {
  constructor(public inputModel: BanUserInputUseCaseType) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserUseCase implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private commandBus: CommandBus,
    private userRepository: SqlUsersRepository,
    private blogsRepository: SqlBlogsRepository,
    private postsRepository: SqlPostsRepository,
    private commentsRepository: SqlCommentsRepository,
    private likesRepository: SqlLikesRepository,
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
      await this.likesRepository.banPostUsers(
        banInfo.id,
        command.inputModel.isBanned,
      );
      await this.likesRepository.banCommentUsers(
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
      await this.likesRepository.banPostUsers(
        banInfo.id,
        command.inputModel.isBanned,
      );
      await this.likesRepository.banCommentUsers(
        banInfo.id,
        command.inputModel.isBanned,
      );

      return banInfo;
    }
  }
}
