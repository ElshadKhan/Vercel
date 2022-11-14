import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {BlogsQueryRepository} from "./blogs.queryRepository";
import {pagination} from "../middleware/queryValidation";

@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService,
              private blogsQueryRepository: BlogsQueryRepository) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll(@Query() query: any ) {
    return this.blogsQueryRepository.findAll(pagination(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsQueryRepository.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.blogsService.delete(id);
  }

  @Delete()
  @HttpCode(204)
  deleteAll() {
    return this.blogsService.deleteAll();
  }
}
