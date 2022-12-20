import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentDtoType } from '../dto/commentDtoType';
import { CreateCommentDbType } from '../dto/createCommentDbType';
import { LikeStatusEnam } from '../../../helpers/helpFunctions';
import { UsersQueryRepository } from '../../../users/infrastructure/users.queryRepository';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { PostsQueryRepository } from '../../../posts/infrastructure/posts.queryRepository';
import { CommentCreateUseCaseDtoType } from '../dto/commentCreateUseCaseDtoType';

export class CreateCommentCommand {
  constructor(public inputModel: CommentCreateUseCaseDtoType) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<CommentDtoType | null> {
    const user = await this.usersQueryRepository.getUser(
      command.inputModel.userId,
    );
    const post = await this.postsQueryRepository.findPostById(
      command.inputModel.postId,
    );
    console.log('post', post);
    if (!post) return null;
    const comment: CreateCommentDbType = {
      id: String(+new Date()),
      content: command.inputModel.content,
      createdAt: new Date().toISOString(),
      commentatorInfo: {
        userId: command.inputModel.userId,
        userLogin: user.accountData.login,
      },
      postInfo: {
        ownerUserId: post.userId,
        postId: post.id,
        title: post.title,
        blogId: post.blogId,
        blogName: post.blogName,
      },
      isBan: false,
    };
    const newComment = await this.commentsRepository.create(comment);
    return {
      id: newComment.id,
      content: newComment.content,
      userId: newComment.postInfo.ownerUserId,
      userLogin: user.accountData.login,
      createdAt: newComment.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatusEnam.None,
      },
    };
  }
}
