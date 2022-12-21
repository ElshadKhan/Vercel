import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Blog, BlogDbTypeWithId } from '../domain/entities/blog.entity';
import { CreateBlogDbType } from '../domain/dto/createBlogDbType';
import { UpdateBlogOnNewUserRepo } from '../domain/dto/updateBlogDbType';
import { BanBlogsRepoDto } from '../domain/dto/updateBlogsBindType';

@Injectable()
export class BlogsRepository {
  @InjectModel(Blog.name) private blogModel: Model<BlogDbTypeWithId>;

  async create(blog: CreateBlogDbType) {
    return await this.blogModel.create(blog);
    // const blogInstance = new this.blogModel()
    // blogInstance.id = blog.id
    // blogInstance.name = blog.name
    // blogInstance.description = blog.description
    // blogInstance.websiteUrl = blog.websiteUrl
    // blogInstance.createdAt = blog.createdAt
    // await blogInstance.save()
    // return blog
  }

  async update(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ) {
    const result = await this.blogModel.updateOne(
      { id },
      {
        $set: { name, description, websiteUrl },
      },
    );
    return result.matchedCount === 1;
    // const blogInstance = await this.blogModel.findOne({id})
    // if(!blogInstance) return false
    // blogInstance.name = name
    // blogInstance.description = description
    // blogInstance.websiteUrl = websiteUrl
    // await blogInstance.save()
    // return true
  }

  async updateBlogsOnNewUser(model: UpdateBlogOnNewUserRepo) {
    const result = await this.blogModel.updateOne(
      { id: model.blogId },
      {
        blogOwnerInfo: {
          userId: model.userId,
          userLogin: model.userLogin,
        },
      },
    );
    return;
  }

  async banUsers(userId: string, value: boolean) {
    return this.blogModel.updateMany(
      { 'blogOwnerInfo.userId': userId },
      {
        'banInfo.isBanned': value,
      },
    );
  }

  async banBlogs(banBlogDto: BanBlogsRepoDto) {
    return this.blogModel.updateOne(
      { id: banBlogDto.blogId },
      {
        'banInfo.isBanned': banBlogDto.isBanned,
        'banInfo.banDate': banBlogDto.banDate,
      },
    );
  }

  async delete(id: string) {
    const result = await this.blogModel.deleteOne({ id });
    return result.deletedCount === 1;
    // const blogInstance = await this.blogModel.findOne({id})
    // if(!blogInstance) return false
    // await blogInstance.deleteOne()
    // return true
  }

  deleteAll() {
    return this.blogModel.deleteMany({});
  }
}
