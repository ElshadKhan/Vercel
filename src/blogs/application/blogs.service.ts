import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { CreateBlogDbType } from '../domain/dto/createBlogDbType';
import { CreateBlogDto } from '../domain/dto/createBlogDto';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  create(createBlogDto: CreateBlogDto) {
    const newBlog = new CreateBlogDbType(
      String(+new Date()),
      createBlogDto.name,
      createBlogDto.description,
      createBlogDto.websiteUrl,
      new Date().toISOString(),
    );
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
