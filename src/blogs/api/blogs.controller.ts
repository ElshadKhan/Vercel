import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/blogs.queryRepository';
import { pagination } from '../../helpers/middleware/queryValidation';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.queryRepository';
import { SpecialBearerAuthGuard } from '../../auth/guards/special.bearer.auth.guard';
import { CurrentUserId } from '../../auth/current-user-id.param.decorator';
import { CommandBus } from '@nestjs/cqrs';

@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  findAll(@Query() query: any) {
    return this.blogsQueryRepository.findAllBlogs(pagination(query));
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
    @CurrentUserId() currentUserId: string,
  ) {
    const result = await this.postsQueryRepository.findOneByBlogId(
      blogId,
      pagination(query),
      currentUserId,
    );
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }
}
