import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Post, PostDbType } from './entities/post.entity';
import { CreatePostDbType } from './dto/create-post.dto';

@Injectable()
export class PostsRepository {
  @InjectModel(Post.name) private postModel: Model<PostDbType>;

  async create(post: CreatePostDbType) {
    await this.postModel.create(post);
    return post;
    // const postInstance = new this.postModel();
    // postInstance.id = post.id;
    // postInstance.title = post.title;
    // postInstance.shortDescription = post.shortDescription;
    // postInstance.content = post.content;
    // postInstance.blogId = post.blogId;
    // postInstance.blogName = post.blogName;
    // postInstance.createdAt = post.createdAt;
    // await postInstance.save();
    // return post;
  }

  async update(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ) {
    const result = await this.postModel.updateOne(
      { id: id },
      {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
        },
      },
    );
    return result.matchedCount === 1;
    // const postInstance = await this.postModel.findOne({ id });
    // if (!postInstance) return false;
    // postInstance.title = title;
    // postInstance.shortDescription = shortDescription;
    // postInstance.content = content;
    // postInstance.blogId = blogId;
    // await postInstance.save();
    // return true;
  }

  async delete(id: string) {
    const result = await this.postModel.deleteOne({ id });
    return result.deletedCount === 1;
    // const postInstance = await this.postModel.findOne({ id });
    // if (!postInstance) return false;
    // await postInstance.deleteOne();
    // return true;
  }

  async deleteAll() {
    return await this.postModel.deleteMany({});
  }
}
