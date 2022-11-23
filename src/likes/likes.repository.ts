import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Like, LikeDbType, LikeDbTypeWithId } from './entities/like.entity';

@Injectable()
export class LikesRepository {
  @InjectModel(Like.name) private likeModel: Model<LikeDbTypeWithId>;

  async createLikeStatus(newLikeStatus: LikeDbType): Promise<LikeDbType> {
    await this.likeModel.create(newLikeStatus);
    return newLikeStatus;
  }
  async updateLikeStatusComment(
    parentId: string,
    userId: string,
    likeStatus: string,
  ): Promise<boolean> {
    const result = await this.likeModel.updateOne(
      { userId: userId, parentId: parentId },
      { $set: { type: likeStatus, createdAt: new Date().toISOString() } },
    );
    return result.matchedCount === 1;
  }
}
