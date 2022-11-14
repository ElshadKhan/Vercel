import { Injectable } from '@nestjs/common';
import { CreateBlogDbType, CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogsRepository } from './blogs.repository';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  create(createBlogDto: CreateBlogDto) {
    const newBlog: CreateBlogDbType = {
      id: String(+new Date()),
      name: createBlogDto.name,
      youtubeUrl: createBlogDto.youtubeUrl,
      createdAt: new Date().toISOString(),
    };
    this.blogsRepository.create(newBlog);
    return newBlog;
  }

  update(id: string, updateBlogDto: UpdateBlogDto) {
    return this.blogsRepository.update(
      id,
      updateBlogDto.name,
      updateBlogDto.youtubeUrl,
    );
  }

  delete(id: string) {
    return this.blogsRepository.delete(id);
  }

  deleteAll() {
    return this.blogsRepository.deleteAll();
  }
}
