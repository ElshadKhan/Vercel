import { Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { LikesDto, LikeStatusEnam } from './dto/like-enam.dto';
import { LikesRepository } from './likes.repository';
import { LikesQueryRepository } from './likes.queryRepository';
import { LikeDbType } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    private likesRepository: LikesRepository,
    private likesQueryRepository: LikesQueryRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}
  async updateLikeStatus(
    likeStatus: LikeStatusEnam,
    parentId: string,
    userId: string,
  ): Promise<boolean> {
    if (!userId) return false;
    const likeDislikeStatus = await this.likesQueryRepository.getLikeStatus(
      parentId,
      userId,
    );
    const user = await this.usersQueryRepository.getUser(userId);
    if (!likeDislikeStatus) {
      const newLikeStatus: LikeDbType = {
        parentId: parentId,
        userId: userId,
        login: user.accountData.login,
        type: likeStatus,
        createdAt: new Date().toISOString(),
      };
      await this.likesRepository.createLikeStatus(newLikeStatus);
      return true;
    }
    return await this.likesRepository.updateLikeStatusComment(
      parentId,
      userId,
      likeStatus,
    );
  }

  deleteAll() {
    return this.likesRepository.deleteAll();
  }
}
