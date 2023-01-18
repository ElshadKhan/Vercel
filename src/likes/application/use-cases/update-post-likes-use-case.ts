import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsLikeDbType } from '../../domain/dto/likeDbType';
import { LikesQueryRepository } from '../../infrastructure/likes.queryRepository';
import { UsersQueryRepository } from '../../../users/infrastructure/users.queryRepository';
import { LikesRepository } from '../../infrastructure/likes.repository';
import { PostLikesUseCasesDtoType } from '../../domain/dto/commentLikesUseCasesDtoType';
import { SqlUsersQueryRepository } from '../../../users/infrastructure/sql.users.queryRepository';
import { SqlLikesRepository } from '../../infrastructure/sql.likes.repository';
import { SqlLikesQueryRepository } from '../../infrastructure/sql.likes.queryRepository';

export class UpdatePostLikesCommand {
  constructor(public useCaseDto: PostLikesUseCasesDtoType) {}
}

@CommandHandler(UpdatePostLikesCommand)
export class UpdatePostLikesUseCase
  implements ICommandHandler<UpdatePostLikesCommand>
{
  constructor(
    private likesQueryRepository: SqlLikesQueryRepository,
    private usersQueryRepository: SqlUsersQueryRepository,
    private likesRepository: SqlLikesRepository,
  ) {}

  async execute(command: UpdatePostLikesCommand): Promise<boolean> {
    if (!command.useCaseDto.userId) return false;
    const likeDislikeStatus =
      await this.likesQueryRepository.getPostLikesStatus(
        command.useCaseDto.postId,
        command.useCaseDto.userId,
      );
    const user = await this.usersQueryRepository.findUserById(
      command.useCaseDto.userId,
    );
    if (!likeDislikeStatus) {
      const newLikeStatus: PostsLikeDbType = {
        type: command.useCaseDto.likesStatus,
        userId: command.useCaseDto.userId,
        postId: command.useCaseDto.postId,
        login: user.accountData.login,
        createdAt: new Date().toISOString(),
        isBanned: false,
      };
      await this.likesRepository.createPostLikeStatus(newLikeStatus);
      return true;
    }
    return await this.likesRepository.updatePostLikeStatusComment(
      command.useCaseDto.postId,
      command.useCaseDto.userId,
      command.useCaseDto.likesStatus,
    );
  }
}
