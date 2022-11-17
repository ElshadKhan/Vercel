import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Query,
  Put,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogsQueryRepository } from './blogs.queryRepository';
import { pagination } from '../middleware/queryValidation';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { PostsService } from '../posts/posts.service';
import { PostsQueryRepository } from '../posts/posts.queryRepository';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Post(':id/posts')
  createPostByBlogId(
    @Param('id') blogId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(
      createPostDto.title,
      createPostDto.shortDescription,
      createPostDto.content,
      blogId,
    );
  }

  @Get()
  findAll(@Query() query: any) {
    return this.blogsQueryRepository.findAll(pagination(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsQueryRepository.findOne(id);
  }

  @Get(':id/posts')
  async findOneByBlogId(@Param('id') blogId: string, @Query() query: any) {
    const result = await this.postsQueryRepository.findOneByBlogId(
      blogId,
      pagination(query),
    );
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @Put(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    const result = await this.blogsService.update(id, updateBlogDto);
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    const result = await this.blogsService.delete(id);
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @Delete()
  @HttpCode(204)
  deleteAll() {
    return this.blogsService.deleteAll();
  }
}
