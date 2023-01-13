import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsLikeDbType } from '../../domain/dto/likeDbType';
import { LikesQueryRepository } from '../../infrastructure/likes.queryRepository';
import { UsersQueryRepository } from '../../../users/infrastructure/users.queryRepository';
import { LikesRepository } from '../../infrastructure/likes.repository';
import { CommentLikesUseCasesDtoType } from '../../domain/dto/commentLikesUseCasesDtoType';
import { SqlUsersQueryRepository } from '../../../users/infrastructure/sql.users.queryRepository';

export class UpdateCommentLikesCommand {
  constructor(public useCaseDto: CommentLikesUseCasesDtoType) {}
}

@CommandHandler(UpdateCommentLikesCommand)
export class UpdateCommentLikesUseCase
  implements ICommandHandler<UpdateCommentLikesCommand>
{
  constructor(
    private likesQueryRepository: LikesQueryRepository,
    private usersQueryRepository: SqlUsersQueryRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute(command: UpdateCommentLikesCommand): Promise<boolean> {
    if (!command.useCaseDto.userId) return false;
    const likeDislikeStatus =
      await this.likesQueryRepository.getCommentLikesStatus(
        command.useCaseDto.commentId,
        command.useCaseDto.userId,
      );
    const user = await this.usersQueryRepository.findUserById(
      command.useCaseDto.userId,
    );
    if (!likeDislikeStatus) {
      const newLikeStatus: CommentsLikeDbType = {
        type: command.useCaseDto.likesStatus,
        userId: command.useCaseDto.userId,
        commentId: command.useCaseDto.commentId,
        login: user.accountData.login,
        createdAt: new Date().toISOString(),
        isBanned: false,
      };
      await this.likesRepository.createCommentLikeStatus(newLikeStatus);
      return true;
    }
    return await this.likesRepository.updateCommentLikeStatusComment(
      command.useCaseDto.commentId,
      command.useCaseDto.userId,
      command.useCaseDto.likesStatus,
    );
  }
}
