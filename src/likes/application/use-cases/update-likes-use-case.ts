import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeDbType } from '../../domain/dto/likeDbType';
import { LikesQueryRepository } from '../../infrastructure/likes.queryRepository';
import { UsersQueryRepository } from '../../../users/infrastructure/users.queryRepository';
import { LikesRepository } from '../../infrastructure/likes.repository';
import { LikesUseCasesDtoType } from '../../domain/dto/likesUseCasesDtoType';

export class UpdateLikesCommand {
  constructor(public useCaseDto: LikesUseCasesDtoType) {}
}

@CommandHandler(UpdateLikesCommand)
export class UpdateLikesUseCase implements ICommandHandler<UpdateLikesCommand> {
  constructor(
    private likesQueryRepository: LikesQueryRepository,
    private usersQueryRepository: UsersQueryRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute(command: UpdateLikesCommand): Promise<boolean> {
    if (!command.useCaseDto.userId) return false;
    const likeDislikeStatus = await this.likesQueryRepository.getLikeStatus(
      command.useCaseDto.parentId,
      command.useCaseDto.userId,
    );
    const user = await this.usersQueryRepository.getUser(
      command.useCaseDto.userId,
    );
    if (!likeDislikeStatus) {
      const newLikeStatus: LikeDbType = {
        type: command.useCaseDto.likesStatus,
        userId: command.useCaseDto.userId,
        parentId: command.useCaseDto.parentId,
        login: user.accountData.login,
        createdAt: new Date().toISOString(),
        isBanned: false,
      };
      await this.likesRepository.createLikeStatus(newLikeStatus);
      return true;
    }
    return await this.likesRepository.updateLikeStatusComment(
      command.useCaseDto.parentId,
      command.useCaseDto.userId,
      command.useCaseDto.likesStatus,
    );
  }
}
