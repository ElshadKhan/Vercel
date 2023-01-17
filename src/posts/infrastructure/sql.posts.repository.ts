import { Injectable } from '@nestjs/common';
import { CreatePostDbType } from '../application/dto/createPostDb';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SqlPostsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async create(post: CreatePostDbType) {
    await this.dataSource.query(
      `INSERT INTO "Posts"("id", "userId", "blogId", "title", "shortDescription", "content", "createdAt", "isBanned") 
    VALUES('${post.id}', '${post.userId}', '${post.blogId}', '${post.title}', '${post.shortDescription}', '${post.content}', '${post.createdAt}', '${post.isBanned}')`,
    );
    return post;
  }
  async update(
    postId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ) {
    const result = await this.dataSource
      .query(`UPDATE "Posts" SET "title" = '${title}',
          "shortDescription" = '${shortDescription}',
          "content" = '${content}',
          "blogId" = '${blogId}' WHERE "id" = '${postId}'`);
    return result[1] === 1;
  }

  async banUsers(userId: string, value: boolean) {
    const result = await this.dataSource.query(
      `UPDATE "Posts" SET "isBanned" = ${value} WHERE "userId" = '${userId}'`,
    );
    return result[1] === 1;
  }

  async banBlogs(blogId: string, value: boolean) {
    const result = await this.dataSource.query(
      `UPDATE "Posts" SET "isBanned" = ${value} WHERE "blogId" = '${blogId}'`,
    );
    return result[1] === 1;
  }

  async delete(id: string) {
    const result = await this.dataSource.query(
      `DELETE FROM "Posts" WHERE "id" = '${id}'`,
    );
    return result[1] === 1;
  }

  async deleteAll() {
    return await this.dataSource.query(`DELETE FROM "Posts"`);
  }
}
