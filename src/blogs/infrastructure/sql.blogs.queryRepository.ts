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
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SqlBlogsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  @InjectModel(Blog.name) private blogModel: Model<BlogDbTypeWithId>;

  async findAllBlogs({
    searchNameTerm,
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
  }: QueryValidationType): Promise<BlogsBusinessType> {
    const skip = getSkipNumber(pageNumber, pageSize);
    const blogs = await this.dataSource
      .query(`SELECT blogs.*, ban."isBanned" FROM "Blogs" AS blogs
 LEFT JOIN "BlogsBanInfo" AS ban
 ON blogs."id" = ban."blogId"
 WHERE LOWER (blogs."name") LIKE LOWER ('${searchNameTerm}')
 AND ban."isBanned" IS false
 ORDER BY "${sortBy}" '${sortDirection}'
 LIMIT ${pageSize} OFFSET ${skip}`);
    const totalCountBlogs = await this.dataSource
      .query(`SELECT count(*) FROM "Blogs" AS blogs
 LEFT JOIN "BlogsBanInfo" AS ban
 ON blogs."id" = ban."blogId"
 WHERE LOWER (blogs."name") LIKE LOWER ('${searchNameTerm}')
 AND ban."isBanned" IS false
 ORDER BY "${sortBy}" '${sortDirection}'
 LIMIT ${pageSize} OFFSET ${skip}`);
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
    const skip = getSkipNumber(pageNumber, pageSize);
    const blogs = await this.dataSource.query(
      `SELECT blogs.*,  users."login", ban."isBanned", ban."banDate" FROM "Blogs" AS blogs
    LEFT JOIN "BlogsBanInfo" AS ban
    ON blogs."id" = ban."blogId"
    LEFT JOIN "Users" AS users
    ON blogs."userId" = users."id"
    WHERE LOWER (blogs."name") LIKE LOWER ('%${searchNameTerm}%')
    ORDER BY "${sortBy}" '${sortDirection}'
    LIMIT ${pageSize} OFFSET ${skip}`,
    );
    const totalCountBlogs = await this.dataSource.query(
      `SELECT count(*) FROM "Blogs"
    WHERE LOWER ("name") LIKE LOWER ('%${searchNameTerm}%')
    ORDER BY "${sortBy}" '${sortDirection}'
    LIMIT ${pageSize} OFFSET ${skip}`,
    );
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
          userId: b.userId,
          userLogin: b.login,
        },
        banInfo: {
          isBanned: b.isBanned,
          banDate: b.banDate,
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
    const skip = getSkipNumber(pageNumber, pageSize);
    const blogs = await this.dataSource.query(
      `SELECT blogs.*, ban."isBanned" 
    FROM "Blogs" AS blogs
    LEFT JOIN "BlogsBanInfo" AS ban
    ON blogs."id" = ban."blogId"
    WHERE LOWER (blogs."name") LIKE LOWER ('%${searchNameTerm}%')
    AND blogs."userId" = '${currentUserId}'
    AND ban."isBanned" IS false
    ORDER BY "${sortBy}" '${sortDirection}'
    LIMIT ${pageSize} OFFSET ${skip}`,
    );
    const totalCountBlogs = await this.dataSource
      .query(`SELECT count(*) FROM "Blogs" AS blogs
    LEFT JOIN "BlogsBanInfo" AS ban
    ON blogs."id" = ban."blogId" 
    WHERE LOWER ("name") LIKE LOWER ('%${searchNameTerm}%')
    AND "userId" = '${currentUserId}'
    AND ban."isBanned" IS false`);
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
    const findBlog = await this.dataSource.query(
      `SELECT blogs.*, ban."isBanned" FROM "Blogs" AS blogs
    LEFT JOIN "BlogsBanInfo" AS ban
    ON blogs."id" = ban."blogId"
    WHERE blogs."id" = '${id}'
    AND ban."isBanned" IS false`,
    );
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
    const blog = await this.dataSource.query(
      `SELECT blogs.*,  users."login", ban."isBanned", ban."banDate" FROM "Blogs" AS blogs
    LEFT JOIN "BlogsBanInfo" AS ban
    ON blogs."id" = ban."blogId"
    LEFT JOIN "Users" AS users
    ON blogs."userId" = users."id"
    WHERE blogs."id" = '${id}'
    AND ban."isBanned" IS false`,
    );
    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      blogOwnerInfo: {
        userId: blog.userId,
        userLogin: blog.login,
      },
      banInfo: {
        isBanned: blog.isBanned,
        banDate: blog.banDate,
      },
    };
  }
}
