import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsService } from '../blogs/application/blogs.service';
import { PostsService } from '../posts/application/posts.service';
import { CommentsService } from '../comments/application/comments.service';
import { LikesService } from '../likes/application/likes.service';
import { SessionsService } from '../sessions/application/sessions.service';
import { UsersService } from '../users/application/users.service';

@Controller('testing/all-data')
export class RemoveAllDataController {
  constructor(
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
    await this.blogsService.deleteAll();
    await this.postsService.deleteAll();
    await this.commentsService.deleteAll();
    await this.likesService.deleteAll();
    return await this.sessionsService.deleteAll();
  }
}
