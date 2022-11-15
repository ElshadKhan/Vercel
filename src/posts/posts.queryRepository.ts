import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { getPagesCounts, getSkipNumber } from '../helpers/helpFunctions';
import { Post, PostDbType } from './entities/post.entity';
import { QueryValidationType } from '../middleware/queryValidation';
import { CreatePostDbType, PostsBusinessType } from './dto/create-post.dto';

@Injectable()
export class PostsQueryRepository {
  @InjectModel(Post.name) private postModel: Model<PostDbType>;

  async findAll({
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
  }: QueryValidationType): Promise<PostsBusinessType> {
    const posts = await this.postModel
      .find()
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountPosts = await this.postModel.find().count();
    if (posts) {
      const promise = posts.map(async (post: PostDbType) => {
        return {
          id: post!.id,
          title: post!.title,
          shortDescription: post!.shortDescription,
          content: post!.content,
          blogId: post!.blogId,
          blogName: post!.blogName,
          createdAt: post!.createdAt,
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
  ): Promise<PostsBusinessType> {
    const posts = await this.postModel.find({ blogId });
    const totalCountPosts = await this.postModel.find().count();
    if (posts) {
      const promise = posts.map(async (post: PostDbType) => {
        return {
          id: post!.id,
          title: post!.title,
          shortDescription: post!.shortDescription,
          content: post!.content,
          blogId: post!.blogId,
          blogName: post!.blogName,
          createdAt: post!.createdAt,
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

  async findOne(id: string): Promise<CreatePostDbType> {
    return await this.postModel.findOne({ id });
  }
}
