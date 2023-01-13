import { Controller, Delete, HttpCode } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteAllCommentsCommand } from '../comments/application/use-cases/delete-all-comments-use-case';
import { DeleteAllPostLikesCommand } from '../likes/application/use-cases/delete-all-Post-likes-use-case';
import { DeleteAllBlogsCommand } from '../blogs/application/use-cases/delete-all-blogs-use-case';
import { DeleteAllSessionsCommand } from '../sessions/application/use-cases/delete-all-sessions-use-case';
import { DeleteAllUsersCommand } from '../users/application/use-cases/delete-all-users-use-case';
import { DeleteAllPostsCommand } from '../posts/application/use-cases/delete-all-posts-use-case';
import { DeleteAllCommentLikesCommand } from '../likes/application/use-cases/delete-all-Comment-likes-use-case';

@Controller('testing/all-data')
export class RemoveAllDataController {
  constructor(private commandBus: CommandBus) {}

  @Delete()
  @HttpCode(204)
  async deleteAllUsers() {
    await this.commandBus.execute(new DeleteAllUsersCommand());
    await this.commandBus.execute(new DeleteAllBlogsCommand());
    await this.commandBus.execute(new DeleteAllPostsCommand());
    await this.commandBus.execute(new DeleteAllCommentsCommand());
    await this.commandBus.execute(new DeleteAllPostLikesCommand());
    await this.commandBus.execute(new DeleteAllCommentLikesCommand());
    await this.commandBus.execute(new DeleteAllSessionsCommand());
    return;
  }
}
