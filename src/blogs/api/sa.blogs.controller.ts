import {
  Controller,
  Get,
  Body,
  Param,
  HttpCode,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.queryRepository';
import { pagination } from '../../helpers/middleware/queryValidation';
import { PostsService } from '../../posts/application/posts.service';
import { BasicAuthGuard } from '../../auth/guards/basic.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { BanBlogsInputModel } from '../domain/dto/updateBlogDbType';
import { IdModelType } from '../domain/dto/updateBlogsBindType';
import { BanBlogCommand } from '../application/use-cases/ban-blog-use-case';
import { UpdateBlogForNewUserCommand } from '../application/use-cases/update-blog-for-newUser-use-case';

@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class BlogsSaController {
  constructor(
    private commandBus: CommandBus,
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  findAll(@Query() query: any) {
    return this.blogsQueryRepository.findAllBlogsForSa(pagination(query));
  }

  @Put(':id/bind-with-user/:userId')
  @HttpCode(204)
  async updateBlogsBindWithUser(@Param() inputModel: IdModelType) {
    return this.commandBus.execute(new UpdateBlogForNewUserCommand(inputModel));
  }

  @Put(':id/ban')
  @HttpCode(204)
  updateBanBlogs(
    @Param('id') id: string,
    @Body() inputModel: BanBlogsInputModel,
  ) {
    const banBlogUseCaseDto = {
      blogId: id,
      isBanned: inputModel.isBanned,
    };
    return this.commandBus.execute(new BanBlogCommand(banBlogUseCaseDto));
  }
}
