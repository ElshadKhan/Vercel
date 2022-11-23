import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from './users/entities/users.entity';
import { UsersQueryRepository } from './users/users.queryRepository';
import { PasswordService } from './password/password.service';
import { Blog, BlogSchema } from './blogs/entities/blog.entity';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';
import { BlogsQueryRepository } from './blogs/blogs.queryRepository';
import { BlogsController } from './blogs/blogs.controller';
import { Post, PostSchema } from './posts/entities/post.entity';
import { PostsService } from './posts/posts.service';
import { PostsController } from './posts/posts.controller';
import { PostsRepository } from './posts/posts.repository';
import { PostsQueryRepository } from './posts/posts.queryRepository';
import { Comment, CommentSchema } from './comments/entities/comment.entity';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { CommentsQueryRepository } from './comments/comments.queryRepository';
import { CommentsRepository } from './comments/comments.repository';
import { AuthModule } from './auth/auth.module';
import { LikesModule } from './likes/likes.module';
import { SessionsModule } from './sessions/sessions.module';
import { Like, LikeSchema } from './likes/entities/like.entity';
import { LikesService } from './likes/likes.service';
import { LikesRepository } from './likes/likes.repository';
import { LikesQueryRepository } from './likes/likes.queryRepository';

const schemas = [
  { name: User.name, schema: UserSchema },
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: Like.name, schema: LikeSchema },
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(schemas),
    AuthModule,
    LikesModule,
    SessionsModule,
  ],
  controllers: [
    AppController,
    UsersController,
    BlogsController,
    PostsController,
    CommentsController,
  ],
  providers: [
    AppService,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    LikesService,
    LikesRepository,
    LikesQueryRepository,
    PasswordService,
  ],
})
export class AppModule {}
