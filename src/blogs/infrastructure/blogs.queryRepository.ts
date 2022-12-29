import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { getPagesCounts, getSkipNumber } from '../../helpers/helpFunctions';
import { Blog, BlogDbTypeWithId } from '../domain/entities/blog.entity';
import { QueryValidationType } from '../../helpers/middleware/queryValidation';
import {
  BlogsBusinessType,
  SaBlogsBusinessType,
} from '../domain/dto/blogBusinessType';
import { CreateBlogDtoType } from '../domain/dto/createBlogDbType';

@Injectable()
export class BlogsQueryRepository {
  @InjectModel(Blog.name) private blogModel: Model<BlogDbTypeWithId>;

  async findAllBlogs({
    searchNameTerm,
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
  }: QueryValidationType): Promise<BlogsBusinessType> {
    const blogs = await this.blogModel
      .find(
        {
          $and: [
            {
              name: { $regex: searchNameTerm, $options: '(?i)a(?-i)cme' },
            },
            {
              'banInfo.isBanned': false,
            },
          ],
        },
        { _id: false, __v: 0, 'banInfo.isBanned': 0 },
      )
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountBlogs = await this.blogModel
      .find(
        {
          $and: [
            {
              name: { $regex: searchNameTerm, $options: '(?i)a(?-i)cme' },
            },
            {
              'banInfo.isBanned': false,
            },
          ],
        },
        { _id: false, __v: 0, 'banInfo.isBanned': 0 },
      )
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

  async findAllBlogsForSa({
    searchNameTerm,
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
  }: QueryValidationType): Promise<SaBlogsBusinessType> {
    const blogs = await this.blogModel
      .find({
        name: { $regex: searchNameTerm, $options: '(?i)a(?-i)cme' },
      })
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
    const blogDto = new SaBlogsBusinessType(
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
        blogOwnerInfo: {
          userId: b.blogOwnerInfo.userId,
          userLogin: b.blogOwnerInfo.userLogin,
        },
        banInfo: {
          isBanned: b.banInfo.isBanned,
          banDate: b.banInfo.banDate,
        },
      })),
    );
    return blogDto;
  }

  async findAllBloggerBlogs(
    {
      searchNameTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    }: QueryValidationType,
    currentUserId: string,
  ): Promise<BlogsBusinessType> {
    const blogs = await this.blogModel
      .find({
        $and: [
          { name: { $regex: searchNameTerm, $options: '(?i)a(?-i)cme' } },
          { 'blogOwnerInfo.userId': currentUserId },
          {
            'banInfo.isBanned': false,
          },
        ],
      })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountBlogs = await this.blogModel
      .find({
        $and: [
          { name: { $regex: searchNameTerm, $options: '(?i)a(?-i)cme' } },
          { 'blogOwnerInfo.userId': currentUserId },
          {
            'banInfo.isBanned': false,
          },
        ],
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

  async findOne(id: string): Promise<CreateBlogDtoType | null> {
    const findBlog = await this.blogModel.findOne({
      id,
      'banInfo.isBanned': false,
    });
    if (findBlog) {
      const blog = new CreateBlogDtoType(
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

  async findBlogById(id: string): Promise<Blog> {
    return this.blogModel.findOne({ id, 'banInfo.isBanned': false });
  }

  async findBlogByUserId(id: string): Promise<Blog> {
    return this.blogModel.findOne(
      { 'blogOwnerInfo.userId': id, isBanned: false },
      { _id: false, __v: 0, banInfo: 0 },
    );
  }
}
