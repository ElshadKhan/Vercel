import { Module } from '@nestjs/common';
import { UsersController } from './users/api/users.controller';
import { UsersService } from './users/application/users.service';
import { UsersRepository } from './users/infrastructure/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from './users/domain/entities/users.entity';
import { UsersQueryRepository } from './users/infrastructure/users.queryRepository';
import { PasswordService } from './helpers/password/password.service';
import { Blog, BlogSchema } from './blogs/domain/entities/blog.entity';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/blogs.queryRepository';
import { BlogsController } from './blogs/api/blogs.controller';
import { Post, PostSchema } from './posts/domain/entities/post.entity';
import { PostsService } from './posts/application/posts.service';
import { PostsController } from './posts/api/posts.controller';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './posts/infrastructure/posts.queryRepository';
import {
  Comment,
  CommentSchema,
} from './comments/domain/entities/comment.entity';
import { CommentsController } from './comments/api/comments.controller';
import { CommentsService } from './comments/application/comments.service';
import { CommentsQueryRepository } from './comments/infrastructure/comments.queryRepository';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { LikesService } from './likes/application/likes.service';
import { LikesRepository } from './likes/infrastructure/likes.repository';
import { LikesQueryRepository } from './likes/infrastructure/likes.queryRepository';
import { Like, LikeSchema } from './likes/domain/entities/like.entity';
import {
  Session,
  SessionSchema,
} from './sessions/domain/entities/session.entity';
import { SessionsRepository } from './sessions/infrastructure/sessionsRepository';
import { SessionsQueryRepository } from './sessions/infrastructure/sessionsQueryRepository';
import { SessionsService } from './sessions/application/sessions.service';
import { SessionsController } from './sessions/api/sessions.controller';
import { JwtService } from './auth/application/jwt-service';
import { EmailManagers } from './helpers/managers/emailManagers';
import { EmailAdapter } from './helpers/adapters/emailAdapter';
import { PasswordManagers } from './helpers/managers/passwordManagers';
import { PasswordAdapter } from './helpers/adapters/passwordAdapter';
import { AuthController } from './auth/api/auth.controller';
import { AuthService } from './auth/application/auth.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { RemoveAllDataController } from './helpers/remove.all.data.controller';
import { BlogExistsRule } from './helpers/middleware/blogIdValidator';
import { AuthModule } from './auth/auth.module';
import { BasicStrategy } from './auth/strategies/basic.strategy';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { LocalStrategy } from './auth/strategies/local.strategy';

const schemas = [
  { name: User.name, schema: UserSchema },
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: Like.name, schema: LikeSchema },
  { name: Session.name, schema: SessionSchema },
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
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
  ],
  controllers: [
    UsersController,
    BlogsController,
    PostsController,
    CommentsController,
    SessionsController,
    AuthController,
    RemoveAllDataController,
  ],
  providers: [
    BlogExistsRule,
    AuthService,
    JwtService,
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
    SessionsService,
    SessionsRepository,
    SessionsQueryRepository,
    EmailManagers,
    EmailAdapter,
    PasswordManagers,
    PasswordAdapter,
    PasswordService,
    BasicStrategy,
    JwtStrategy,
    LocalStrategy,
  ],
})
export class AppModule {}
