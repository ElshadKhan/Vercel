import { Injectable } from '@nestjs/common';
import { LikeStatusEnam } from '../domain/dto/like-enam.dto';
import { CommentsLikeDbType, PostsLikeDbType } from '../domain/dto/likeDbType';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SqlLikesRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createCommentLikeStatus(
    newLikeStatus: CommentsLikeDbType,
  ): Promise<CommentsLikeDbType> {
    await this.dataSource.query(
      `INSERT INTO "CommentLikesInfo"("userId", "commentId", "type", "createdAt", "isBanned")
    VALUES('${newLikeStatus.userId}','${newLikeStatus.commentId}','${newLikeStatus.type}','${newLikeStatus.createdAt}', ${newLikeStatus.isBanned})`,
    );
    return newLikeStatus;
  }

  async createPostLikeStatus(
    newLikeStatus: PostsLikeDbType,
  ): Promise<PostsLikeDbType> {
    await this.dataSource.query(
      `INSERT INTO "PostLikesInfo"("userId", "postId", "type", "createdAt", "isBanned")
    VALUES('${newLikeStatus.userId}','${newLikeStatus.postId}','${newLikeStatus.type}','${newLikeStatus.createdAt}', ${newLikeStatus.isBanned})`,
    );
    return newLikeStatus;
  }

  async updateCommentLikeStatusComment(
    commentId: string,
    userId: string,
    likeStatus: LikeStatusEnam,
  ): Promise<boolean> {
    const createDate = new Date().toISOString();
    const result = await this.dataSource.query(
      `UPDATE "CommentLikesInfo" SET "type" = '${likeStatus}', "createdAt" = '${createDate}'
    WHERE "userId" = '${userId}'
    AND "commentId" = '${commentId}'`,
    );
    return result[1] === 1;
  }

  async updatePostLikeStatusComment(
    postId: string,
    userId: string,
    likeStatus: LikeStatusEnam,
  ): Promise<boolean> {
    const createDate = new Date().toISOString();
    const result = await this.dataSource.query(
      `UPDATE "PostLikesInfo" SET "type" = '${likeStatus}', "createdAt" = '${createDate}'
    WHERE "userId" = '${userId}'
    AND "commentId" = '${postId}'`,
    );
    return result[1] === 1;
  }

  async banCommentUsers(userId: string, value: boolean) {
    const result = await this.dataSource.query(
      `UPDATE "CommentLikesInfo" SET "isBanned" = ${value} WHERE "userId" = '${userId}'`,
    );
    return result[1] === 1;
  }

  async banPostUsers(userId: string, value: boolean) {
    const result = await this.dataSource.query(
      `UPDATE "PostLikesInfo" SET "isBanned" = ${value} WHERE "userId" = '${userId}'`,
    );
    return result[1] === 1;
  }

  async deleteAllCommentLikes() {
    const result = await this.dataSource.query(
      `DELETE FROM "CommentLikesInfo"`,
    );
    return result[1] === 1;
  }

  async deleteAllPostLikes() {
    const result = await this.dataSource.query(`DELETE FROM "PostLikesInfo"`);
    return result[1] === 1;
  }
}
