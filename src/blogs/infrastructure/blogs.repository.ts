import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Blog, BlogDbTypeWithId } from '../domain/entities/blog.entity';
import { CreateBlogDbType } from '../domain/dto/create-blog.dto';

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

  async delete(id: string) {
    const result = await this.blogModel.deleteOne({ id });
    return result.deletedCount === 1;
    // const blogInstance = await this.blogModel.findOne({id})
    // if(!blogInstance) return false
    // await blogInstance.deleteOne()
    // return true
  }

  async deleteAll() {
    return await this.blogModel.deleteMany({});
  }
}
