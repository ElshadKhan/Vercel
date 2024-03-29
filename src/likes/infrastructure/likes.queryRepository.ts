import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  CommentLike,
  CommentLikeDbTypeWithId,
  PostLike,
  PostLikeDbTypeWithId,
} from '../domain/entities/NO_SQL_entity/like.entity';
import { PostsLikeDbType, CommentsLikeDbType } from '../domain/dto/likeDbType';

@Injectable()
export class LikesQueryRepository {
  @InjectModel(PostLike.name)
  private postLikeModel: Model<PostLikeDbTypeWithId>;
  @InjectModel(CommentLike.name)
  private commentLikeModel: Model<CommentLikeDbTypeWithId>;

  async getCommentLikesStatus(
    commentId: string,
    userId: string,
  ): Promise<CommentsLikeDbType | null> {
    return this.commentLikeModel.findOne({
      $and: [{ commentId: commentId }, { userId: userId }, { isBanned: false }],
    });
  }

  async getPostLikesStatus(
    postId: string,
    userId: string,
  ): Promise<PostsLikeDbType | null> {
    return this.postLikeModel.findOne({
      $and: [{ postId: postId }, { userId: userId }, { isBanned: false }],
    });
  }

  async getCommentLikesCount(id: string, like: string): Promise<number> {
    return this.commentLikeModel.countDocuments({
      $and: [{ commentId: id }, { type: like }, { isBanned: false }],
    });
  }

  async getPostLikesCount(id: string, like: string): Promise<number> {
    return this.postLikeModel.countDocuments({
      $and: [{ postId: id }, { type: like }, { isBanned: false }],
    });
  }

  async getCommentDislikesCount(id: string, dislike: string): Promise<number> {
    return this.commentLikeModel.countDocuments({
      $and: [{ parentId: id }, { type: dislike }, { isBanned: false }],
    });
  }

  async getPostDislikesCount(id: string, dislike: string): Promise<number> {
    return this.postLikeModel.countDocuments({
      $and: [{ postId: id }, { type: dislike }, { isBanned: false }],
    });
  }

  async getPostLastLikes(id: string, like: string): Promise<PostLike[]> {
    return this.postLikeModel
      .find({ $and: [{ postId: id }, { type: like }, { isBanned: false }] })
      .sort([['createdAt', -1]]);
  }
}
