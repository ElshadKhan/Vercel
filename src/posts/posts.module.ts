import { Module } from '@nestjs/common';
import { PostsService } from './application/posts.service';
import { PostsController } from './api/posts.controller';
import { BlogsModule } from '../blogs/blogs.module';

@Module({
  imports: [BlogsModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
