import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../../../sessions/application/sessions.service';

export class UpdateUserCommand {
  constructor(public updateDto: UpdateBlogDbType) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserUseCase implements ICommandHandler<UpdateUserCommand> {
  constructor(private sessionService: SessionsService) {}

  async execute(command: UpdateUserCommand) {
    if (inputModel.isBanned) {
      const newUser = new BanUsersFactory(
        id,
        inputModel.isBanned,
        new Date().toISOString(),
        inputModel.banReason,
      );

      await this.sessionService.deleteUserDevices(newUser.id);
      await this.userRepository.updateUsers(newUser);
      await this.blogsRepository.banUsers(newUser.id, inputModel.isBanned);
      await this.postsRepository.banUsers(newUser.id, inputModel.isBanned);
      await this.commentsRepository.banUsers(newUser.id, inputModel.isBanned);

      return newUser;
    } else {
      const newUser = new BanUsersFactory(id, inputModel.isBanned, null, null);

      await this.userRepository.updateUsers(newUser);
      await this.blogsRepository.banUsers(newUser.id, inputModel.isBanned);
      await this.postsRepository.banUsers(newUser.id, inputModel.isBanned);
      await this.commentsRepository.banUsers(newUser.id, inputModel.isBanned);

      return newUser;
    }
  }
}
