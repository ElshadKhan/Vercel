import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsService } from '../blogs/application/blogs.service';
import { PostsService } from '../posts/application/posts.service';
import { CommentsService } from '../comments/application/comments.service';
import { LikesService } from '../likes/application/likes.service';
import { SessionsService } from '../sessions/application/sessions.service';
import { UsersService } from '../users/application/users.service';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteAllCommentsCommand } from '../comments/application/use-cases/delete-all-comments-use-case';
import { DeleteAllLikesCommand } from '../likes/application/use-cases/delete-all-likes-use-case';
import { DeleteAllBlogsCommand } from '../blogs/application/use-cases/delete-all-blogs-use-case';
import { DeleteAllSessionsCommand } from '../sessions/application/use-cases/delete-all-sessions-use-case';

@Controller('testing/all-data')
export class RemoveAllDataController {
  constructor(
    private commandBus: CommandBus,
    private usersService: UsersService,
    private blogsService: BlogsService,
    private postsService: PostsService,
    private commentsService: CommentsService,
    private likesService: LikesService,
    private sessionsService: SessionsService,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAllUsers() {
    await this.usersService.deleteAll();
    await this.commandBus.execute(new DeleteAllBlogsCommand());
    await this.postsService.deleteAll();
    await this.commandBus.execute(new DeleteAllCommentsCommand());
    await this.commandBus.execute(new DeleteAllLikesCommand());
    await this.commandBus.execute(new DeleteAllSessionsCommand());
    return;
  }
}
