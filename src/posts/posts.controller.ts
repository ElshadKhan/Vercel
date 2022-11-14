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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDtoBlogId } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsQueryRepository } from './posts.queryRepository';
import { pagination } from '../middleware/queryValidation';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Post()
  create(@Body() createPostDto: CreatePostDtoBlogId) {
    return this.postsService.create(
      createPostDto.title,
      createPostDto.shortDescription,
      createPostDto.content,
      createPostDto.blogId,
    );
  }

  @Get()
  findAll(@Query() query: any) {
    return this.postsQueryRepository.findAll(pagination(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsQueryRepository.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdatePostDto) {
    return this.postsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }

  @Delete()
  @HttpCode(204)
  deleteAll() {
    return this.postsService.deleteAll();
  }
}
