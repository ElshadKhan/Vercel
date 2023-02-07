import { Injectable } from '@nestjs/common';
import {
  CommentLike,
  CommentLikeDbTypeWithId,
  PostLike,
  PostLikeDbTypeWithId,
} from '../domain/entities/NO_SQL_entity/like.entity';
import { PostsLikeDbType, CommentsLikeDbType } from '../domain/dto/likeDbType';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SqlLikesQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  @InjectModel(CommentLike.name)
  private commentLikeModel: Model<CommentLikeDbTypeWithId>;
  @InjectModel(PostLike.name)
  private postLikeModel: Model<PostLikeDbTypeWithId>;

  async getCommentLikesStatus(
    commentId: string,
    userId: string,
  ): Promise<CommentsLikeDbType | null> {
    console.log('commentId', commentId);
    console.log('userId', userId);
    const result = await this.dataSource.query(
      `SELECT c.*, u."login" FROM "CommentLikesInfo" AS c
    LEFT JOIN "Users" AS u
    ON c."userId" = u."id"
    WHERE "commentId" = '${commentId}'
    AND "userId" = '${userId}'
    AND "isBanned" IS false`,
    );
    console.log('result', result);
    if (!result[0]) return null;
    return {
      type: result[0].type,
      userId: result[0].userId,
      commentId: result[0].commentId,
      login: result[0].login,
      createdAt: result[0].createdAt,
      isBanned: result[0].isBanned,
    };
  }

  async getPostLikesStatus(
    postId: string,
    userId: string,
  ): Promise<PostsLikeDbType | null> {
    const result = await this.dataSource.query(
      `SELECT p.*, u."login" FROM "PostLikesInfo" AS p
    LEFT JOIN "Users" AS u
    ON p."userId" = u."id"
    WHERE "postId" = '${postId}'
    AND "userId" = '${userId}'
    AND "isBanned" IS false`,
    );
    console.log('PostLikes', result);
    if (!result[0]) return null;
    return {
      type: result[0].type,
      userId: result[0].userId,
      postId: result[0].postId,
      login: result[0].login,
      createdAt: result[0].createdAt,
      isBanned: result[0].isBanned,
    };
  }

  async getCommentLikesCount(id: string, like: string): Promise<number> {
    const likesCount = await this.dataSource.query(
      `SELECT count(*) FROM "CommentLikesInfo"
    WHERE "commentId" = '${id}'
    AND "type" = '${like}'
    AND "isBanned" IS false`,
    );
    return +likesCount[0].count;
  }

  async getPostLikesCount(id: string, like: string): Promise<number> {
    const likesCount = await this.dataSource.query(
      `SELECT count(*) FROM "PostLikesInfo"
    WHERE "postId" = '${id}'
    AND "type" = '${like}'
    AND "isBanned" IS false`,
    );
    return +likesCount[0].count;
  }

  async getCommentDislikesCount(id: string, dislike: string): Promise<number> {
    const likesCount = await this.dataSource.query(
      `SELECT count(*) FROM "CommentLikesInfo"
    WHERE "commentId" = '${id}'
    AND "type" = '${dislike}'
    AND "isBanned" IS false`,
    );
    return +likesCount[0].count;
  }

  async getPostDislikesCount(id: string, dislike: string): Promise<number> {
    const likesCount = await this.dataSource.query(
      `SELECT count(*) FROM "PostLikesInfo"
    WHERE "postId" = '${id}'
    AND "type" = '${dislike}'
    AND "isBanned" IS false`,
    );
    return +likesCount[0].count;
  }

  async getPostLastLikes(id: string, like: string): Promise<PostsLikeDbType[]> {
    console.log('postId', id);
    console.log('type', like);
    const result = await this.dataSource.query(
      `SELECT p.*, u."login" FROM "PostLikesInfo" AS p
    LEFT JOIN "Users" AS u
    ON p."userId" = u."id"
    WHERE "postId" = '${id}'
    AND "type" = '${like}'
    AND "isBanned" IS false
    ORDER BY "createdAt" DESC`,
    );
    console.log('result', result);
    return result;
  }
}
