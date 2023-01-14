import { Module } from '@nestjs/common';
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
import {
  CommentLike,
  CommentLikeSchema,
  PostLike,
  PostLikeSchema,
} from './likes/domain/entities/like.entity';
import {
  Session,
  SessionSchema,
} from './sessions/domain/entities/session.entity';
import {
  BloggerUsersBan,
  BloggerUsersBanSchema,
} from './users/domain/entities/blogger.users.blogs.ban.entity';
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
import { RegistrationUserUseCase } from './auth/application/use-cases/registration-user-use-case';
import { CheckCredentialsUseCase } from './auth/application/use-cases/check-credentials-use-case';
import { EmailResendingUseCase } from './auth/application/use-cases/email-resending-use-case';
import { PasswordResendingUseCase } from './auth/application/use-cases/password-resending-use-case';
import { EmailConfirmationUseCase } from './auth/application/use-cases/email-confirmation-use-case';
import { PasswordConfirmationUseCase } from './auth/application/use-cases/password-confirmation-use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogUseCase } from './blogs/application/use-cases/create-blog-use-case';
import { UpdateBlogUseCase } from './blogs/application/use-cases/update-blog-use-case';
import { DeleteBlogUseCase } from './blogs/application/use-cases/delete-blog-use-case';
import { DeleteAllBlogsUseCase } from './blogs/application/use-cases/delete-all-blogs-use-case';
import { CreateCommentUseCase } from './comments/application/use-cases/create-comment-use-case';
import { UpdateCommentUseCase } from './comments/application/use-cases/update-comment-use-case';
import { DeleteCommentUseCase } from './comments/application/use-cases/delete-comment-use-case';
import { DeleteAllCommentsUseCase } from './comments/application/use-cases/delete-all-comments-use-case';
import { UpdateCommentLikesUseCase } from './likes/application/use-cases/update-comment-likes-use-case';
import { DeleteAllPostLikesUseCase } from './likes/application/use-cases/delete-all-Post-likes-use-case';
import { CreateSessionUseCase } from './sessions/application/use-cases/create-session-use-case';
import { UpdateSessionUseCase } from './sessions/application/use-cases/update-session-use-case';
import { DeleteSessionsByDeviceIdUseCase } from './sessions/application/use-cases/delete-sessions-byDeviceId-use-case';
import { DeleteAllSessionsExceptOneUseCase } from './sessions/application/use-cases/delete-all-sessions-exceptOne-use-case';
import { DeleteAllSessionsUseCase } from './sessions/application/use-cases/delete-all-sessions-use-case';
import { CreateUserUseCase } from './users/application/use-cases/create-user-use-case';
import { DeleteUserUseCase } from './users/application/use-cases/delete-user-use-case';
import { DeleteAllUsersUseCase } from './users/application/use-cases/delete-all-users-use-case';
import { CreatePostUseCase } from './posts/application/use-cases/create-post-use-case';
import { UpdatePostUseCase } from './posts/application/use-cases/update-post-use-case';
import { DeletePostUseCase } from './posts/application/use-cases/delete-post-use-case';
import { DeleteAllPostsUseCase } from './posts/application/use-cases/delete-all-posts-use-case';
import { SaUsersController } from './users/api/sa.users.controller';
import { UpdateUserUseCase } from './users/application/use-cases/update-user-use-case';
import { DeleteAllUserSessionsUseCase } from './sessions/application/use-cases/delete-all-user-sessions-use-case';
import { BloggersController } from './blogs/api/blogger.controller';
import { BlogsSaController } from './blogs/api/sa.blogs.controller';
import { UserExistsRule } from './helpers/middleware/userIdValidator';
import { UpdateBlogForNewUserUseCase } from './blogs/application/use-cases/update-blog-for-newUser-use-case';
import { BanBlogUseCase } from './blogs/application/use-cases/ban-blog-use-case';
import { UpdateBanBloggerUserUseCase } from './users/application/use-cases/update-banBlogerUser-use-case';
import { BloggerUsersController } from './users/api/blogger.users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqlUsersRepository } from './users/infrastructure/sql.users.repository';
import { SqlUsersQueryRepository } from './users/infrastructure/sql.users.queryRepository';
import { SqlSessionsQueryRepository } from './sessions/infrastructure/sqlSessionsQueryRepository';
import { SqlSessionsRepository } from './sessions/infrastructure/sqlSessionsRepository';
import process from 'process';
import { UpdatePostLikesUseCase } from './likes/application/use-cases/update-post-likes-use-case';
import { DeleteAllCommentLikesUseCase } from './likes/application/use-cases/delete-all-Comment-likes-use-case';
import { SqlLikesRepository } from './likes/infrastructure/sql.likes.repository';
import { SqlLikesQueryRepository } from './likes/infrastructure/sql.likes.queryRepository';
import { SqlPostsRepository } from './posts/infrastructure/sql.posts.repository';
import { SqlPostsQueryRepository } from './posts/infrastructure/sql.posts.queryRepository';
import { SqlCommentsRepository } from './comments/infrastructure/sql.comments.repository';
import { SqlCommentsQueryRepository } from './comments/infrastructure/sql.comments.queryRepository';
import { SqlBlogsRepository } from './blogs/infrastructure/sql.blogs.repository';
import { SqlBlogsQueryRepository } from './blogs/infrastructure/sql.blogs.queryRepository';

const schemas = [
  { name: User.name, schema: UserSchema },
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: CommentLike.name, schema: CommentLikeSchema },
  { name: PostLike.name, schema: PostLikeSchema },
  { name: Session.name, schema: SessionSchema },
  { name: BloggerUsersBan.name, schema: BloggerUsersBanSchema },
];

const authUseCases = [
  RegistrationUserUseCase,
  CheckCredentialsUseCase,
  EmailResendingUseCase,
  PasswordResendingUseCase,
  EmailConfirmationUseCase,
  PasswordConfirmationUseCase,
];

const blogsUseCases = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  DeleteAllBlogsUseCase,
  UpdateBlogForNewUserUseCase,
  BanBlogUseCase,
];

const usersUseCases = [
  CreateUserUseCase,
  DeleteUserUseCase,
  DeleteAllUsersUseCase,
  UpdateUserUseCase,
  UpdateBanBloggerUserUseCase,
];

const postsUseCases = [
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  DeleteAllPostsUseCase,
];

const commentsUseCases = [
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  DeleteAllCommentsUseCase,
];

const sessionsUseCases = [
  CreateSessionUseCase,
  UpdateSessionUseCase,
  DeleteSessionsByDeviceIdUseCase,
  DeleteAllSessionsExceptOneUseCase,
  DeleteAllSessionsUseCase,
  DeleteAllUserSessionsUseCase,
];

const likesUseCases = [
  UpdatePostLikesUseCase,
  UpdateCommentLikesUseCase,
  DeleteAllPostLikesUseCase,
  DeleteAllCommentLikesUseCase,
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST || 'localhost',
      port: 5432,
      username: process.env.PG_USERNAME || 'nodejs',
      password: process.env.PG_PASSWORD || 'password',
      database: process.env.PG_DATABASE || 'ItIncubatorNest',
      autoLoadEntities: false,
      synchronize: false,
      ssl: true,
    }),
    // TypeOrmModule.forFeature(),
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
    CqrsModule,
  ],
  controllers: [
    BloggerUsersController,
    SaUsersController,
    BlogsSaController,
    BlogsController,
    BloggersController,
    PostsController,
    CommentsController,
    SessionsController,
    AuthController,
    RemoveAllDataController,
  ],
  providers: [
    UserExistsRule,
    BlogExistsRule,
    // AuthService,
    JwtService,
    // UsersService,
    UsersRepository,
    SqlUsersRepository,
    UsersQueryRepository,
    SqlUsersQueryRepository,
    // BlogsService,
    BlogsRepository,
    SqlBlogsRepository,
    BlogsQueryRepository,
    SqlBlogsQueryRepository,
    // PostsService,
    PostsRepository,
    SqlPostsRepository,
    PostsQueryRepository,
    SqlPostsQueryRepository,
    // CommentsService,
    CommentsRepository,
    SqlCommentsRepository,
    CommentsQueryRepository,
    SqlCommentsQueryRepository,
    // LikesService,
    LikesRepository,
    SqlLikesRepository,
    LikesQueryRepository,
    SqlLikesQueryRepository,
    // SessionsService,
    SessionsRepository,
    SqlSessionsRepository,
    SessionsQueryRepository,
    SqlSessionsQueryRepository,
    EmailManagers,
    EmailAdapter,
    PasswordManagers,
    PasswordAdapter,
    PasswordService,
    ...authUseCases,
    ...blogsUseCases,
    ...commentsUseCases,
    ...likesUseCases,
    ...sessionsUseCases,
    ...usersUseCases,
    ...postsUseCases,
  ],
})
export class AppModule {}
