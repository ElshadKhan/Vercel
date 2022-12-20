import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Like, LikeDbTypeWithId } from '../domain/entities/like.entity';
import { LikeDbType } from '../domain/dto/likeDbType';

@Injectable()
export class LikesQueryRepository {
  @InjectModel(Like.name) private likeModel: Model<LikeDbTypeWithId>;

  async getLikeStatus(
    parentId: string,
    userId: string,
  ): Promise<LikeDbType | null> {
    return this.likeModel.findOne({
      $and: [{ parentId: parentId }, { userId: userId }, { isBan: false }],
    });
  }
  async getLikesCount(id: string, like: string): Promise<number> {
    return this.likeModel.countDocuments({
      $and: [{ parentId: id }, { type: like }, { isBan: false }],
    });
  }
  async getDislikesCount(id: string, dislike: string): Promise<number> {
    return this.likeModel.countDocuments({
      $and: [{ parentId: id }, { type: dislike }, { isBan: false }],
    });
  }
  async getLastLikes(id: string, like: string): Promise<LikeDbTypeWithId[]> {
    return this.likeModel
      .find({ $and: [{ parentId: id }, { type: like }, { isBan: false }] })
      .sort([['createdAt', -1]]);
  }
}
