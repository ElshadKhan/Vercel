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
    const post = await this.postsQueryRepository.findOne(
      command.inputModel.postId,
      command.inputModel.userId,
    );
    if (!post) return null;
    const comment: CreateCommentDbType = {
      id: String(+new Date()),
      content: command.inputModel.content,
      userId: command.inputModel.userId,
      userLogin: user.accountData.login,
      postId: command.inputModel.postId,
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatusEnam.None,
      },
    };
    const newComment = await this.commentsRepository.create(comment);
    return {
      id: newComment.id,
      content: newComment.content,
      userId: newComment.userId,
      userLogin: newComment.userLogin,
      createdAt: newComment.createdAt,
      likesInfo: {
        likesCount: newComment.likesInfo.likesCount,
        dislikesCount: newComment.likesInfo.dislikesCount,
        myStatus: newComment.likesInfo.myStatus,
      },
    };
  }
}
