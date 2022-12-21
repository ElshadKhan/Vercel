import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from 'src/blogs/infrastructure/blogs.repository';
import { DeleteAllUserSessionsCommand } from '../../../sessions/application/use-cases/delete-all-user-sessions-use-case';
import { UsersRepository } from '../../infrastructure/users.repository';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { CommentsRepository } from 'src/comments/infrastructure/comments.repository';
import {
  BanUserInputUseCaseType,
  BanUsersFactory,
} from '../../api/dto/update-user-banStatus-dto';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';

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
      const newUser = new BanUsersFactory(
        command.inputModel.id,
        command.inputModel.isBanned,
        new Date().toISOString(),
        command.inputModel.banReason,
      );

      await this.commandBus.execute(
        new DeleteAllUserSessionsCommand(newUser.id),
      );
      await this.userRepository.updateUsers(newUser);
      await this.blogsRepository.banUsers(
        newUser.id,
        command.inputModel.isBanned,
      );
      await this.postsRepository.banUsers(
        newUser.id,
        command.inputModel.isBanned,
      );
      await this.commentsRepository.banUsers(
        newUser.id,
        command.inputModel.isBanned,
      );
      await this.likesRepository.banUsers(
        newUser.id,
        command.inputModel.isBanned,
      );

      return newUser;
    } else {
      const newUser = new BanUsersFactory(
        command.inputModel.id,
        command.inputModel.isBanned,
        null,
        null,
      );

      await this.userRepository.updateUsers(newUser);
      await this.blogsRepository.banUsers(
        newUser.id,
        command.inputModel.isBanned,
      );
      await this.postsRepository.banUsers(
        newUser.id,
        command.inputModel.isBanned,
      );
      await this.commentsRepository.banUsers(
        newUser.id,
        command.inputModel.isBanned,
      );
      await this.likesRepository.banUsers(
        newUser.id,
        command.inputModel.isBanned,
      );

      return newUser;
    }
  }
}
