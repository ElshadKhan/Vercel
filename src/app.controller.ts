import { Controller, Delete, HttpCode } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { BlogsService } from './blogs/blogs.service';
import { PostsService } from './posts/posts.service';
import { CommentsService } from './comments/comments.service';

@Controller('testing')
export class AppController {
  constructor(
    private usersService: UsersService,
    private blogsService: BlogsService,
    private postsService: PostsService,
    private commentsService: CommentsService,
  ) {}

  @Delete('all-data')
  @HttpCode(204)
  deleteAllUsers() {
    this.usersService.deleteAll();
    this.blogsService.deleteAll();
    this.postsService.deleteAll();
    this.commentsService.deleteAll();
  }
}
