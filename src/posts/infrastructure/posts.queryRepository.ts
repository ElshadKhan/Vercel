import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  getPagesCounts,
  getSkipNumber,
  LikeStatusEnam,
} from '../../helpers/helpFunctions';
import { Post, PostDbTypeWithId } from '../domain/entities/post.entity';
import { QueryValidationType } from '../../helpers/middleware/queryValidation';
import { PostsBusinessType } from './dto/postBusinessType';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.queryRepository';
import { LikesQueryRepository } from '../../likes/infrastructure/likes.queryRepository';
import { UserAccountDBType } from '../../users/domain/dto/user.account.dto';
import { PostDbType, PostDtoType } from '../application/dto/PostDto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private likesQueryRepository: LikesQueryRepository,
  ) {}
  @InjectModel(Post.name) private postModel: Model<PostDbTypeWithId>;

  async findAll(
    { pageNumber, pageSize, sortBy, sortDirection }: QueryValidationType,
    userId?: string,
  ): Promise<PostsBusinessType> {
    const posts = await this.postModel
      .find()
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountPosts = await this.postModel.find().count();
    if (posts) {
      const promise = posts.map(async (post: PostDbTypeWithId) => {
        let myStatus = LikeStatusEnam.None;

        if (userId) {
          const result = await this.likesQueryRepository.getLikeStatus(
            post.id,
            userId,
          );
          myStatus = result?.type || LikeStatusEnam.None;
        }
        const likesCount = await this.likesQueryRepository.getLikesCount(
          post.id,
          LikeStatusEnam.Like,
        );
        const dislikesCount = await this.likesQueryRepository.getDislikesCount(
          post.id,
          LikeStatusEnam.Dislike,
        );
        const lastLikes = await this.likesQueryRepository.getLastLikes(
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
    blogId: string,
    { pageNumber, pageSize, sortBy, sortDirection }: QueryValidationType,
    userId?: string,
  ): Promise<PostsBusinessType> {
    const blog = await this.blogsQueryRepository.findOne(blogId);
    const findPosts = await this.postModel
      .find({ blogId })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountPosts = await this.postModel
      .find({ blogId })
      .sort([[sortBy, sortDirection]])
      .count();
    if (blog) {
      const promise = findPosts.map(async (post: PostDbTypeWithId) => {
        let myStatus = LikeStatusEnam.None;

        if (userId) {
          const result = await this.likesQueryRepository.getLikeStatus(
            post.id,
            userId,
          );
          myStatus = result?.type || LikeStatusEnam.None;
        }
        const likesCount = await this.likesQueryRepository.getLikesCount(
          post.id,
          LikeStatusEnam.Like,
        );
        const dislikesCount = await this.likesQueryRepository.getDislikesCount(
          post.id,
          LikeStatusEnam.Dislike,
        );
        const lastLikes = await this.likesQueryRepository.getLastLikes(
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

  async findPostById(id: string): Promise<PostDbType> {
    return await this.postModel.findOne({ id });
  }

  async findOne(id: string, userId?: string): Promise<PostDtoType> {
    const post: PostDbTypeWithId | null = await this.postModel.findOne({
      id,
    });
    if (post) {
      let myStatus = LikeStatusEnam.None;

      if (userId) {
        const result = await this.likesQueryRepository.getLikeStatus(
          post.id,
          userId,
        );
        myStatus = result?.type || LikeStatusEnam.None;
      }
      const likesCount = await this.likesQueryRepository.getLikesCount(
        post.id,
        LikeStatusEnam.Like,
      );
      const dislikesCount = await this.likesQueryRepository.getDislikesCount(
        post.id,
        LikeStatusEnam.Dislike,
      );
      const lastLikes = await this.likesQueryRepository.getLastLikes(
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
