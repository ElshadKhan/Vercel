import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { CreatePostDbType } from './dto/create-post.dto';
import { BlogsQueryRepository } from '../blogs/blogs.queryRepository';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private blogQueryRepository: BlogsQueryRepository,
  ) {}

  async create(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<CreatePostDbType | null> {
    const blog = await this.blogQueryRepository.findOne(blogId);
    if (!blog) return null;
    const newPost: CreatePostDbType = {
      id: String(+new Date()),
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blog.id,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    return await this.postsRepository.create(newPost);
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postsRepository.update(
      id,
      updatePostDto.title,
      updatePostDto.shortDescription,
      updatePostDto.content,
      updatePostDto.blogId,
    );
  }

  delete(id: string) {
    return this.postsRepository.delete(id);
  }

  deleteAll() {
    return this.postsRepository.deleteAll();
  }
}
