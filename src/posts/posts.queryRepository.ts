import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  getPagesCounts,
  getSkipNumber,
  LikeStatusEnam,
} from '../helpers/helpFunctions';
import { Post, PostDbType } from './entities/post.entity';
import { QueryValidationType } from '../middleware/queryValidation';
import { PostDtoType, PostsBusinessType } from './dto/create-post.dto';
import { BlogsQueryRepository } from '../blogs/blogs.queryRepository';
import { LikesQueryRepository } from '../likes/likes.queryRepository';
import { UserAccountDBType } from '../users/dto/user.db';

@Injectable()
export class PostsQueryRepository {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private likesQueryRepository: LikesQueryRepository,
  ) {}
  @InjectModel(Post.name) private postModel: Model<PostDbType>;

  async findAll(
    { pageNumber, pageSize, sortBy, sortDirection }: QueryValidationType,
    user?: UserAccountDBType,
  ): Promise<PostsBusinessType> {
    const posts = await this.postModel
      .find()
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountPosts = await this.postModel.find().count();
    if (posts) {
      const promise = posts.map(async (post: PostDbType) => {
        let myStatus = LikeStatusEnam.None;

        if (user) {
          const result = await this.likesQueryRepository.getLikeStatus(
            post.id,
            user.id,
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
          id: post!.id,
          title: post!.title,
          shortDescription: post!.shortDescription,
          content: post!.content,
          blogId: post!.blogId,
          blogName: post!.blogName,
          createdAt: post!.createdAt,
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
    user?: UserAccountDBType,
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
      const promise = findPosts.map(async (post: PostDbType) => {
        let myStatus = LikeStatusEnam.None;

        if (user) {
          const result = await this.likesQueryRepository.getLikeStatus(
            post.id,
            user.id,
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
          id: post!.id,
          title: post!.title,
          shortDescription: post!.shortDescription,
          content: post!.content,
          blogId: post!.blogId,
          blogName: post!.blogName,
          createdAt: post!.createdAt,
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

  async findOne(id: string, user?: UserAccountDBType): Promise<PostDtoType> {
    const post: PostDbType | null = await this.postModel.findOne({ id: id });
    if (post) {
      let myStatus = LikeStatusEnam.None;

      if (user) {
        const result = await this.likesQueryRepository.getLikeStatus(
          post.id,
          user.id,
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
        id: post!.id,
        title: post!.title,
        shortDescription: post!.shortDescription,
        content: post!.content,
        blogId: post!.blogId,
        blogName: post!.blogName,
        createdAt: post!.createdAt,
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
