import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostDtoType } from '../dto/PostDto';
import { CreatePostDbType } from '../dto/createPostDb';
import { LikeStatusEnam } from '../../../helpers/helpFunctions';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs.queryRepository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { LikesQueryRepository } from '../../../likes/infrastructure/likes.queryRepository';
import { CreatePostUseCaseDto } from '../dto/createPostUseCaseDto';
import { SqlBlogsQueryRepository } from '../../../blogs/infrastructure/sql.blogs.queryRepository';

export class CreatePostCommand {
  constructor(public createPostDto: CreatePostUseCaseDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private blogQueryRepository: SqlBlogsQueryRepository,
    private likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<PostDtoType | null> {
    const blog = await this.blogQueryRepository.findBlogById(
      command.createPostDto.blogId,
    );
    if (!blog) return null;
    const newPost: CreatePostDbType = {
      id: String(+new Date()),
      title: command.createPostDto.title,
      shortDescription: command.createPostDto.shortDescription,
      content: command.createPostDto.content,
      blogId: command.createPostDto.blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
      userId: command.createPostDto.userId,
      isBanned: false,
    };
    const newPostDto = await this.postsRepository.create(newPost);
    const lastLikes = await this.likesQueryRepository.getPostLastLikes(
      newPostDto.id,
      LikeStatusEnam.Like,
    );
    return {
      id: newPostDto.id,
      title: newPostDto.title,
      shortDescription: newPostDto.shortDescription,
      content: newPostDto.content,
      blogId: newPostDto.blogId,
      blogName: blog.name,
      createdAt: newPostDto.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatusEnam.None,
        newestLikes: lastLikes.slice(0, 3).map((p) => ({
          addedAt: p.createdAt,
          userId: p.userId,
          login: p.login,
        })),
      },
    };
  }
}
