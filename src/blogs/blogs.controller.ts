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
  HttpException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { BlogsQueryRepository } from './blogs.queryRepository';
import { pagination } from '../middleware/queryValidation';
import {
  CreatePostBlogIdDto,
  CreatePostDto,
} from '../posts/dto/create-post.dto';
import { PostsService } from '../posts/posts.service';
import { PostsQueryRepository } from '../posts/posts.queryRepository';
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';
import { SpecialBearerAuthGuard } from '../auth/guards/special.bearer.auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Post(':blogId/posts')
  @UseGuards(BasicAuthGuard)
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    const result = await this.postsService.create(
      createPostDto.title,
      createPostDto.shortDescription,
      createPostDto.content,
      blogId,
    );
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @Get()
  findAll(@Query() query: any) {
    return this.blogsQueryRepository.findAll(pagination(query));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.blogsQueryRepository.findOne(id);
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }
  @UseGuards(SpecialBearerAuthGuard)
  @Get(':blogId/posts')
  async findOneByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: any,
    @Req() req,
  ) {
    const result = await this.postsQueryRepository.findOneByBlogId(
      blogId,
      pagination(query),
      req.user,
    );
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async update(@Param('id') id: string, @Body() updateBlogDto: CreateBlogDto) {
    const result = await this.blogsService.update(id, updateBlogDto);
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
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
