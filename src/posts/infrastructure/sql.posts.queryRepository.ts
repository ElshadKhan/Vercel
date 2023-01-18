import { Injectable } from '@nestjs/common';
import {
  getPagesCounts,
  getSkipNumber,
  LikeStatusEnam,
} from '../../helpers/helpFunctions';
import { QueryValidationType } from '../../helpers/middleware/queryValidation';
import { PostsBusinessType } from './dto/postBusinessType';
import { LikesQueryRepository } from '../../likes/infrastructure/likes.queryRepository';
import { PostDbType, PostDtoType } from '../application/dto/PostDto';
import { CreatePostBlogIdDto } from '../api/dto/createPostDto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SqlLikesQueryRepository } from '../../likes/infrastructure/sql.likes.queryRepository';

@Injectable()
export class SqlPostsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    private likesQueryRepository: SqlLikesQueryRepository,
  ) {}

  async findAll(
    { pageNumber, pageSize, sortBy, sortDirection }: QueryValidationType,
    userId?: string,
  ): Promise<PostsBusinessType> {
    const skip = getSkipNumber(pageNumber, pageSize);
    const posts = await this.dataSource.query(
      `SELECT p.*, b."name" AS blogname FROM "Posts" AS p
LEFT JOIN "Blogs" AS b
ON p."blogId" = b."id"
    WHERE "isBanned" IS false
    ORDER BY "${sortBy}" ${sortDirection}
    LIMIT ${pageSize} OFFSET ${skip}`,
    );
    const totalCountSql = await this.dataSource.query(
      `SELECT count(*) FROM "Posts" WHERE "isBanned" IS false`,
    );
    if (posts) {
      const promise = posts.map(async (post) => {
        let myStatus = LikeStatusEnam.None;
        if (userId) {
          const result = await this.likesQueryRepository.getPostLikesStatus(
            post.id,
            userId,
          );
          myStatus = result?.type || LikeStatusEnam.None;
        }
        const likesCount = await this.likesQueryRepository.getPostLikesCount(
          post.id,
          LikeStatusEnam.Like,
        );
        const dislikesCount =
          await this.likesQueryRepository.getPostDislikesCount(
            post.id,
            LikeStatusEnam.Dislike,
          );
        const lastLikes = await this.likesQueryRepository.getPostLastLikes(
          post.id,
          LikeStatusEnam.Like,
        );
        return {
          id: post.id,
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: post.blogname,
          createdAt: post.createdAt,
          extendedLikesInfo: {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: myStatus,
            newestLikes: lastLikes.slice(0, 3).map((p) => ({
              addedAt: p.createdAt,
              userId: p.userId,
              login: p.login,
            })),
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

  async findOneByBlogId(
    blogId: CreatePostBlogIdDto,
    { pageNumber, pageSize, sortBy, sortDirection }: QueryValidationType,
    userId?: string,
  ): Promise<PostsBusinessType> {
    const skip = getSkipNumber(pageNumber, pageSize);
    const findPosts = await this.dataSource.query(
      `SELECT post.*, blog."name" AS blogname FROM "Posts" AS post
    LEFT JOIN "Blogs" AS blog
    ON post."blogId" = blog."id"
    WHERE post."blogId" = '${blogId}'
    AND post."isBanned" IS false
    ORDER BY "${sortBy}" ${sortDirection}
    LIMIT ${pageSize} OFFSET ${skip}`,
    );
    const totalCountSql = await this.dataSource.query(
      `SELECT * FROM "Posts" WHERE "blogId" = '${blogId}' AND "isBanned" IS false`,
    );
    const promise = findPosts.map(async (post) => {
      let myStatus = LikeStatusEnam.None;

      if (userId) {
        const result = await this.likesQueryRepository.getPostLikesStatus(
          post.id,
          userId,
        );
        myStatus = result?.type || LikeStatusEnam.None;
      }
      const likesCount = await this.likesQueryRepository.getPostLikesCount(
        post.id,
        LikeStatusEnam.Like,
      );
      const dislikesCount =
        await this.likesQueryRepository.getPostDislikesCount(
          post.id,
          LikeStatusEnam.Dislike,
        );
      const lastLikes = await this.likesQueryRepository.getPostLastLikes(
        post.id,
        LikeStatusEnam.Like,
      );
      return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogname,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: myStatus,
          newestLikes: lastLikes.slice(0, 3).map((p) => ({
            addedAt: p.createdAt,
            userId: p.userId,
            login: p.login,
          })),
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

  async findPostById(id: string): Promise<PostDbType> {
    const post = await this.dataSource.query(
      `SELECT p.*, b."name" AS blogname FROM "Posts" AS p
    LEFT JOIN "Blogs" AS b
    ON p."blogId" = b."id"
    WHERE p."id" = '${id}'`,
    );
    return {
      id: post[0].id,
      title: post[0].title,
      shortDescription: post[0].shortDescription,
      content: post[0].content,
      blogId: post[0].blogId,
      blogName: post[0].blogname,
      createdAt: post[0].createdAt,
      userId: post[0].userId,
    };
  }

  async findOne(id: string, userId?: string): Promise<PostDtoType> {
    const post = await this.dataSource.query(
      `SELECT p.*, b."name" AS blogname FROM "Posts" AS p
    LEFT JOIN "Blogs" AS b
    ON p."blogId" = b."id"
    WHERE p."id" = '${id}'
    AND "isBanned" IS false`,
    );
    if (post[0]) {
      let myStatus = LikeStatusEnam.None;

      if (userId) {
        const result = await this.likesQueryRepository.getPostLikesStatus(
          post.id,
          userId,
        );
        myStatus = result?.type || LikeStatusEnam.None;
      }
      const likesCount = await this.likesQueryRepository.getPostLikesCount(
        post.id,
        LikeStatusEnam.Like,
      );
      const dislikesCount =
        await this.likesQueryRepository.getPostDislikesCount(
          post.id,
          LikeStatusEnam.Dislike,
        );
      const lastLikes = await this.likesQueryRepository.getPostLastLikes(
        post.id,
        LikeStatusEnam.Like,
      );
      return {
        id: post[0].id,
        title: post[0].title,
        shortDescription: post[0].shortDescription,
        content: post[0].content,
        blogId: post[0].blogId,
        blogName: post[0].blogname,
        createdAt: post[0].createdAt,
        extendedLikesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: myStatus,
          newestLikes: lastLikes.slice(0, 3).map((p) => ({
            addedAt: p.createdAt,
            userId: p.userId,
            login: p.login,
          })),
        },
      };
    }
    return null;
  }
}
