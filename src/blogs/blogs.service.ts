import { Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { CreateBlogDbType, CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  create(createBlogDto: CreateBlogDto) {
    const newBlog: CreateBlogDbType = {
      id: String(+new Date()),
      name: createBlogDto.name,
      description: createBlogDto.description,
      websiteUrl: createBlogDto.websiteUrl,
      createdAt: new Date().toISOString(),
    };
    this.blogsRepository.create(newBlog);
    return newBlog;
  }

  update(id: string, updateBlogDto: CreateBlogDto) {
    return this.blogsRepository.update(
      id,
      updateBlogDto.name,
      updateBlogDto.description,
      updateBlogDto.websiteUrl,
    );
  }

  delete(id: string) {
    return this.blogsRepository.delete(id);
  }

  deleteAll() {
    return this.blogsRepository.deleteAll();
  }
}
