import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { getPagesCounts, getSkipNumber } from '../helpers/helpFunctions';
import { Blog, BlogDbType } from './domain/blog.entity';
import { QueryValidationResult } from '../middleware/queryValidation';
import { BlogsBusinessType, CreateBlogDbType } from './dto/create-blog.dto';

@Injectable()
export class BlogsQueryRepository {
  @InjectModel(Blog.name) private blogModel: Model<BlogDbType>;

  async findAll({
    searchNameTerm,
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
  }: QueryValidationResult): Promise<BlogsBusinessType> {
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
        youtubeUrl: b.youtubeUrl,
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
        findBlog.youtubeUrl,
        findBlog.createdAt,
      );
      return blog;
    }
    return findBlog;
  }
}
