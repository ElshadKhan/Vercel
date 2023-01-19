import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/blogs.queryRepository';
import { pagination } from '../../helpers/middleware/queryValidation';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.queryRepository';
import { SpecialBearerAuthGuard } from '../../auth/guards/special.bearer.auth.guard';
import { CurrentUserId } from '../../auth/current-user-id.param.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { SqlBlogsQueryRepository } from '../infrastructure/sql.blogs.queryRepository';
import { CreatePostBlogIdDto } from '../../posts/api/dto/createPostDto';
import { SqlPostsQueryRepository } from '../../posts/infrastructure/sql.posts.queryRepository';

@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    private blogsQueryRepository: SqlBlogsQueryRepository,
    private postsQueryRepository: SqlPostsQueryRepository,
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
    @Req() req,
    @Res() res,
  ) {
    const result = await this.blogsQueryRepository.findOne(blogId);
    if (!result) {
      throw new HttpException('invalid blog', 404);
    }
    const posts = await this.postsQueryRepository.findOneByBlogId(
      blogId,
      pagination(query),
      req.user?.id,
    );
    return res.status(200).send(posts);
  }
}
