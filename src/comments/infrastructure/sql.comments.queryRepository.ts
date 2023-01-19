import { Injectable } from '@nestjs/common';
import { QueryValidationType } from '../../helpers/middleware/queryValidation';
import {
  getPagesCounts,
  getSkipNumber,
  LikeStatusEnam,
} from '../../helpers/helpFunctions';
import { CommentDtoType } from '../application/dto/commentDtoType';
import {
  CommentsBusinessDtoType,
  CommentsBusinessType,
} from './dto/commentBusinessType';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SqlLikesQueryRepository } from '../../likes/infrastructure/sql.likes.queryRepository';

@Injectable()
export class SqlCommentsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    private likesRepository: SqlLikesQueryRepository,
  ) {}

  async findCommentByUserIdAndCommentId(
    id: string,
    userId?: string,
  ): Promise<CommentDtoType | null> {
    const comment = await this.dataSource.query(
      `SELECT c.*, u."login" FROM "Comments" AS c
    LEFT JOIN "Users" AS u
    ON c."userId" = u."id"
    WHERE c."id" = '${id}'
    AND c."isBanned" IS false`,
    );
    if (!comment[0]) return null;

    let myStatus = LikeStatusEnam.None;

    if (userId) {
      const result = await this.likesRepository.getCommentLikesStatus(
        id,
        userId,
      );
      myStatus = result?.type || LikeStatusEnam.None;
    }

    const likesCount = await this.likesRepository.getCommentLikesCount(
      id,
      LikeStatusEnam.Like,
    );
    const dislikesCount = await this.likesRepository.getCommentDislikesCount(
      id,
      LikeStatusEnam.Dislike,
    );

    return {
      id: comment[0].id,
      content: comment[0].content,
      userId: comment[0].userId,
      userLogin: comment[0].login,
      createdAt: comment[0].createdAt,
      likesInfo: {
        likesCount: likesCount,
        dislikesCount: dislikesCount,
        myStatus: myStatus,
      },
    };
  }

  async findCommentById(
    id: string,
    userId?: string,
  ): Promise<CommentDtoType | null> {
    const comment = await this.dataSource.query(
      `SELECT c.*, u."login" FROM "Comments" AS c
    LEFT JOIN "Users" AS u
    ON c."userId" = u."id"
    WHERE c."id" = '${id}'
    AND c."isBanned" IS false`,
    );
    if (!comment[0]) return null;
    let myStatus = LikeStatusEnam.None;
    if (userId) {
      const result = await this.likesRepository.getCommentLikesStatus(
        id,
        userId,
      );
      myStatus = result?.type || LikeStatusEnam.None;
    }
    const likesCount = await this.likesRepository.getCommentLikesCount(
      id,
      LikeStatusEnam.Like,
    );
    const dislikesCount = await this.likesRepository.getCommentDislikesCount(
      id,
      LikeStatusEnam.Dislike,
    );
    return {
      id: comment[0].id,
      content: comment[0].content,
      userId: comment[0].userId,
      userLogin: comment[0].login,
      createdAt: comment[0].createdAt,
      likesInfo: {
        likesCount: likesCount,
        dislikesCount: dislikesCount,
        myStatus: myStatus,
      },
    };
  }

  async findAllCommentsCurrentUser(
    { pageNumber, pageSize, sortBy, sortDirection }: QueryValidationType,
    ownerUserId: string,
  ): Promise<CommentsBusinessDtoType | null> {
    const skip = getSkipNumber(pageNumber, pageSize);
    const comments = await this.dataSource.query(
      `SELECT comments.*, users."login", posts."userId" AS postUserId, posts."title",posts."blogId" , blogs."name"
            FROM "Comments" AS comments
            INNER JOIN "Users" AS users
            ON users."id" = comments."userId"
            INNER JOIN "Posts" AS posts
            ON posts."id" = comments."postId"
            INNER JOIN "Blogs" AS blogs
            ON blogs."id" = posts."blogId"
            WHERE posts."userId" = '${ownerUserId}'
            AND comments."isBanned" IS false
            ORDER BY "${sortBy}" ${sortDirection}
            LIMIT ${pageSize} OFFSET ${skip}`,
    );
    const totalCountSql = await this.dataSource.query(
      `SELECT count(*)
            FROM "Comments" AS comments
            INNER JOIN "Users" AS users
            ON users."id" = comments."userId"
            INNER JOIN "Posts" AS posts
            ON posts."id" = comments."postId"
            INNER JOIN "Blogs" AS blogs
            ON blogs."id" = posts."blogId"
            WHERE posts."userId" = '${ownerUserId}'
            AND comments."isBanned" IS false`,
    );
    console.log('totalCountSql', totalCountSql);
    if (comments[0]) {
      const promise = comments.map(async (c) => {
        let myStatus = LikeStatusEnam.None;

        if (ownerUserId) {
          const result = await this.likesRepository.getCommentLikesStatus(
            c.id,
            ownerUserId,
          );
          console.log('result', result);
          myStatus = result?.type || LikeStatusEnam.None;
        }
        const likesCount = await this.likesRepository.getCommentLikesCount(
          c.id,
          LikeStatusEnam.Like,
        );
        const dislikesCount =
          await this.likesRepository.getCommentDislikesCount(
            c.id,
            LikeStatusEnam.Dislike,
          );
        return {
          id: c.id,
          content: c.content,
          createdAt: c.createdAt,
          likesInfo: {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: myStatus,
          },
          commentatorInfo: {
            userId: c.userId,
            userLogin: c.login,
          },
          postInfo: {
            id: c.postId,
            title: c.title,
            blogId: c.blogId,
            blogName: c.name,
          },
        };
      });
      const totalCount = +totalCountSql[0].count;
      const items = await Promise.all(promise);
      return {
        pagesCount: getPagesCounts(totalCount, pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: items,
      };
    }
    return null;
  }

  async findCommentsByPostIdAndUserId(
    postId: string,
    { pageNumber, pageSize, sortBy, sortDirection }: QueryValidationType,
    userId?: string,
  ): Promise<CommentsBusinessType | null> {
    const skip = getSkipNumber(pageNumber, pageSize);
    const comments = await this.dataSource.query(
      `SELECT c.*, u."login" FROM "Comments" AS c
    LEFT JOIN "Users" AS u
    ON c."userId" = u."id"
    WHERE c."postId" = '${postId}'
    AND c."isBanned" IS false
    ORDER BY "${sortBy}" ${sortDirection}
    LIMIT ${pageSize} OFFSET ${skip}`,
    );
    const totalCountSql = await this.dataSource.query(
      `SELECT count(*) FROM "Comments" AS c
    WHERE c."postId" = '${postId}'
    AND c."isBanned" IS false`,
    );
    if (comments[0]) {
      const promise = comments.map(async (c) => {
        let myStatus = LikeStatusEnam.None;

        if (userId) {
          const result = await this.likesRepository.getCommentLikesStatus(
            c.id,
            userId,
          );
          console.log('CommentId', c.id);
          console.log('UserId', userId);
          console.log('LIKESsTATUS', result);
          myStatus = result?.type || LikeStatusEnam.None;
        }
        const likesCount = await this.likesRepository.getCommentLikesCount(
          c.id,
          LikeStatusEnam.Like,
        );
        const dislikesCount =
          await this.likesRepository.getCommentDislikesCount(
            c.id,
            LikeStatusEnam.Dislike,
          );
        return {
          id: c.id,
          content: c.content,
          userId: c.userId,
          userLogin: c.login,
          createdAt: c.createdAt,
          likesInfo: {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: myStatus,
          },
        };
      });
      const totalCount = +totalCountSql[0].count;
      const items = await Promise.all(promise);
      return {
        pagesCount: getPagesCounts(totalCount, pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: items,
      };
    }
    return null;
  }
}
