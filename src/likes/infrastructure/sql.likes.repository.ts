import { Injectable } from '@nestjs/common';
import { LikeStatusEnam } from '../domain/dto/like-enam.dto';
import { CommentsLikeDbType, PostsLikeDbType } from '../domain/dto/likeDbType';

@Injectable()
export class SqlLikesRepository {
  async createCommentLikeStatus(
    newLikeStatus: CommentsLikeDbType,
  ): Promise<CommentsLikeDbType> {
    await this.commentLikeModel.create(newLikeStatus);
    return newLikeStatus;
  }

  async createPostLikeStatus(
    newLikeStatus: PostsLikeDbType,
  ): Promise<PostsLikeDbType> {
    await this.postLikeModel.create(newLikeStatus);
    return newLikeStatus;
  }

  async updateCommentLikeStatusComment(
    commentId: string,
    userId: string,
    likeStatus: LikeStatusEnam,
  ): Promise<boolean> {
    const result = await this.commentLikeModel.updateOne(
      { userId: userId, commentId: commentId },
      { $set: { type: likeStatus, createdAt: new Date().toISOString() } },
    );
    return result.matchedCount === 1;
  }

  async updatePostLikeStatusComment(
    postId: string,
    userId: string,
    likeStatus: LikeStatusEnam,
  ): Promise<boolean> {
    const result = await this.postLikeModel.updateOne(
      { userId: userId, postId: postId },
      { $set: { type: likeStatus, createdAt: new Date().toISOString() } },
    );
    return result.matchedCount === 1;
  }

  async banCommentUsers(userId: string, value: boolean) {
    return this.commentLikeModel.updateMany(
      { userId: userId },
      {
        isBanned: value,
      },
    );
  }

  async banPostUsers(userId: string, value: boolean) {
    return this.postLikeModel.updateMany(
      { userId: userId },
      {
        isBanned: value,
      },
    );
  }

  async deleteAllCommentLikes() {
    return this.commentLikeModel.deleteMany({});
  }

  async deleteAllPostLikes() {
    return this.postLikeModel.deleteMany({});
  }
}
