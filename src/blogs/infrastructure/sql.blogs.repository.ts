import { Injectable } from '@nestjs/common';
import { CreateBlogDbType } from '../domain/dto/createBlogDbType';
import { UpdateBlogOnNewUserRepo } from '../domain/dto/updateBlogDbType';
import { BanBlogsRepoDto } from '../domain/dto/updateBlogsBindType';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class SqlBlogsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async create(blog: CreateBlogDbType) {
    await this.dataSource
      .query(`INSERT INTO "Blogs"("id", "name", "description", "websiteUrl", "createdAt", "userId")
VALUES('${blog.id}', '${blog.name}', '${blog.description}', '${blog.websiteUrl}', '${blog.createdAt}', '${blog.blogOwnerInfo.userId}')`);
    await this.dataSource
      .query(`INSERT INTO "BlogsBanInfo"("blogId", "isBanned", "banDate")
VALUES('${blog.id}', '${blog.banInfo.isBanned}', '${blog.banInfo.banDate}')`);
    return blog;
  }

  async update(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ) {
    const result = await this.dataSource.query(`UPDATE "Blogs"
    SET "name" = '${name}', "description" = '${description}', "websiteUrl" = '${websiteUrl}'
    WHERE "id" = '${id}'`);
    console.log('Update Blog result', result[1] === 1);
    return result[1] === 1;
  }

  async updateBlogsOnNewUser(model: UpdateBlogOnNewUserRepo) {
    const result = await this.dataSource.query(`UPDATE "Blogs"
    SET "userId" = '${model.userId}'
    WHERE "blogId" = '${model.blogId}'`);
    console.log('Update OldBlog userId result', result[1] === 1);
    return result[1] === 1;
  }

  async banUsers(userId: string, value: boolean, date: string) {
    const result = await this.dataSource.query(
      `UPDATE "BlogsBanInfo" 
    SET "isBanned" = '${value}', "banDate" = '${date}'
    WHERE "userId" = '${userId}'`,
    );
    return result[1] === 1;
  }

  async banBlogs(banBlogDto: BanBlogsRepoDto) {
    const result = await this.dataSource.query(
      `UPDATE "BlogsBanInfo" 
    SET "isBanned" = '${banBlogDto.isBanned}', "banDate" = '${banBlogDto.banDate}'
    WHERE "blogId" = '${banBlogDto.blogId}'`,
    );
    return result[1] === 1;
  }

  async delete(id: string) {
    const result = await this.dataSource.query(
      `DELETE FROM "Blogs" WHERE "id" = '${id}'`,
    );
    return result[1] === 1;
  }

  deleteAll() {
    return this.dataSource.query(`DELETE FROM "Blogs"`);
  }
}
