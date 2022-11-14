import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Blog, BlogDbType } from './domain/blog.entity';
import { CreateBlogDbType } from './dto/create-blog.dto';

@Injectable()
export class BlogsRepository {
  @InjectModel(Blog.name) private blogModel: Model<BlogDbType>;

  async create(blog: CreateBlogDbType) {
    return await this.blogModel.create(blog);
    // const blogInstance = new this.blogModel()
    // blogInstance.id = blog.id
    // blogInstance.name = blog.name
    // blogInstance.youtubeUrl = blog.youtubeUrl
    // blogInstance.createdAt = blog.createdAt
    // await blogInstance.save()
    // return blog
  }

  async update(id: string, name: string, youtubeUrl: string) {
    const result = await this.blogModel.updateOne(
      { id },
      { $set: { name: name, youtubeUrl: youtubeUrl } },
    );
    return result.matchedCount === 1;
    // const blogInstance = await this.blogModel.findOne({id})
    // if(!blogInstance) return false
    // blogInstance.name = name
    // blogInstance.youtubeUrl = youtubeUrl
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
