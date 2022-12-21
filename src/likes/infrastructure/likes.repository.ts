import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Like, LikeDbTypeWithId } from '../domain/entities/like.entity';
import { LikeStatusEnam } from '../domain/dto/like-enam.dto';
import { LikeDbType } from '../domain/dto/likeDbType';

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
    likeStatus: LikeStatusEnam,
  ): Promise<boolean> {
    const result = await this.likeModel.updateOne(
      { userId: userId, parentId: parentId },
      { $set: { type: likeStatus, createdAt: new Date().toISOString() } },
    );
    return result.matchedCount === 1;
  }

  async banUsers(userId: string, value: boolean) {
    return this.likeModel.updateMany(
      { userId: userId },
      {
        isBan: value,
      },
    );
  }

  async deleteAll() {
    return this.likeModel.deleteMany({});
  }
}
