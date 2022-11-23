import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDbType } from '../comments/entities/comment.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Like, LikeDbType, LikeDbTypeWithId } from './entities/like.entity';

@Injectable()
export class LikesQueryRepository {
  @InjectModel(Like.name) private likeModel: Model<LikeDbTypeWithId>;

  async getLikeStatus(
    parentId: string,
    userId: string,
  ): Promise<LikeDbType | null> {
    return this.likeModel.findOne({ parentId: parentId, userId: userId });
  }
  async getLikesCount(id: string, like: string): Promise<number> {
    return this.likeModel.countDocuments({ parentId: id, type: like });
  }
  async getDislikesCount(id: string, dislike: string): Promise<number> {
    return this.likeModel.countDocuments({ parentId: id, type: dislike });
  }
  async getLastLikes(id: string, like: string): Promise<LikeDbTypeWithId[]> {
    return this.likeModel
      .find({ parentId: id, type: like })
      .sort([['createdAt', -1]]);
  }
}
