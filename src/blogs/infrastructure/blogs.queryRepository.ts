import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { getPagesCounts, getSkipNumber } from '../../helpers/helpFunctions';
import { Blog, BlogDbTypeWithId } from '../domain/entities/blog.entity';
import { QueryValidationType } from '../../helpers/middleware/queryValidation';
import {
  BlogsBusinessType,
  CreateBlogDbType,
} from '../domain/dto/create-blog.dto';

@Injectable()
export class BlogsQueryRepository {
  @InjectModel(Blog.name) private blogModel: Model<BlogDbTypeWithId>;

  async findAll({
    searchNameTerm,
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
  }: QueryValidationType): Promise<BlogsBusinessType> {
    const blogs = await this.blogModel
      .find({ name: { $regex: searchNameTerm, $options: '(?i)a(?-i)cme' } })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountBlogs = await this.blogModel
      .find({
        name: {
          $regex: searchNameTerm,
          $options: '(?i)a(?-i)cme',
        },
      })
      .count();
    const blogDto = new BlogsBusinessType(
      getPagesCounts(totalCountBlogs, pageSize),
      pageNumber,
      pageSize,
      totalCountBlogs,
      blogs.map((b) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        websiteUrl: b.websiteUrl,
        createdAt: b.createdAt,
      })),
    );

    return blogDto;
  }

  async findOne(id: string): Promise<CreateBlogDbType | null> {
    const findBlog = await this.blogModel.findOne({ id });
    if (findBlog) {
      const blog = new CreateBlogDbType(
        findBlog.id,
        findBlog.name,
        findBlog.description,
        findBlog.websiteUrl,
        findBlog.createdAt,
      );
      return blog;
    }
    return findBlog;
  }
}
