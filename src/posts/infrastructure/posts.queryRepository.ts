import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  getPagesCounts,
  getSkipNumber,
  LikeStatusEnam,
} from '../../helpers/helpFunctions';
import {
  Post,
  PostDbTypeWithId,
} from '../domain/entities/NO_SQL_entities/post.entity';
import { QueryValidationType } from '../../helpers/middleware/queryValidation';
import { PostsBusinessType } from './dto/postBusinessType';
import { LikesQueryRepository } from '../../likes/infrastructure/likes.queryRepository';
import { PostDbType, PostDtoType } from '../application/dto/PostDto';
import { CreatePostBlogIdDto } from '../api/dto/createPostDto';
import { SqlLikesQueryRepository } from '../../likes/infrastructure/sql.likes.queryRepository';

@Injectable()
export class PostsQueryRepository {
  constructor(private likesQueryRepository: SqlLikesQueryRepository) {}
  @InjectModel(Post.name) private postModel: Model<PostDbTypeWithId>;

  async findAll(
    { pageNumber, pageSize, sortBy, sortDirection }: QueryValidationType,
    userId?: string,
  ): Promise<PostsBusinessType> {
    const posts = await this.postModel
      .find({ isBanned: false }, { _id: false, __v: 0, isBanned: 0 })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountPosts = await this.postModel
      .find({ isBanned: false })
      .count();
    if (posts) {
      const promise = posts.map(async (post: PostDbTypeWithId) => {
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
          blogName: post.blogName,
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
      const items = await Promise.all(promise);
      return {
        pagesCount: getPagesCounts(totalCountPosts, pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCountPosts,
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
    const findPosts = await this.postModel
      .find({ blogId, isBanned: false }, { _id: false, __v: 0, isBanned: 0 })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountPosts = await this.postModel
      .find({ blogId, isBanned: false })
      .sort([[sortBy, sortDirection]])
      .count();
    const promise = findPosts.map(async (post: PostDbTypeWithId) => {
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
        blogName: post.blogName,
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
    const items = await Promise.all(promise);
    return {
      pagesCount: getPagesCounts(totalCountPosts, pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCountPosts,
      items: items,
    };
  }

  async findPostById(id: string): Promise<PostDbType> {
    return await this.postModel.findOne({ id });
  }

  async findOne(id: string, userId?: string): Promise<PostDtoType> {
    const post = await this.postModel.findOne(
      { id, isBanned: false },
      { _id: false, __v: 0, isBanned: 0 },
    );
    if (post) {
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
        blogName: post.blogName,
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
    }
    return null;
  }
}
