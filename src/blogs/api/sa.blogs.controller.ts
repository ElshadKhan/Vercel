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
  BadRequestException,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.queryRepository';
import { pagination } from '../../helpers/middleware/queryValidation';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.queryRepository';
import { BasicAuthGuard } from '../../auth/guards/basic.auth.guard';
import { SpecialBearerAuthGuard } from '../../auth/guards/special.bearer.auth.guard';
import { CreatePostDto } from '../../posts/api/dto/createPostDto';
import { CreateBlogDto } from '../domain/dto/createBlogDto';
import { CurrentUserId } from '../../auth/current-user-id.param.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/use-cases/create-blog-use-case';
import { UpdateBlogCommand } from '../application/use-cases/update-blog-use-case';
import { UpdateBlogDbType } from '../domain/dto/updateBlogDbType';
import { DeleteBlogCommand } from '../application/use-cases/delete-blog-use-case';
import { DeleteAllBlogsCommand } from '../application/use-cases/delete-all-blogs-use-case';
import { CreatePostCommand } from '../../posts/application/use-cases/create-post-use-case';
import { CreatePostDtoWithBlogId } from '../../posts/api/dto/createPostWithBlogIdDto';

@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class BlogsSaController {
  constructor(
    private commandBus: CommandBus,
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  // @Post()
  // @UseGuards(BasicAuthGuard)
  // create(@Body() createBlogDto: CreateBlogDto) {
  //   return this.commandBus.execute(new CreateBlogCommand(createBlogDto));
  // }

  // @Post(':blogId/posts')
  // @UseGuards(BasicAuthGuard)
  // async createPostByBlogId(
  //   @Param('blogId') blogId: string,
  //   @Body() createPostDto: CreatePostDto,
  // ) {
  //   const useCaseDto: CreatePostDtoWithBlogId = {
  //     title: createPostDto.title,
  //     shortDescription: createPostDto.shortDescription,
  //     content: createPostDto.content,
  //     blogId: blogId,
  //   };
  //   const result = await this.commandBus.execute(
  //     new CreatePostCommand(useCaseDto),
  //   );
  //   if (!result) {
  //     throw new HttpException({}, 404);
  //   }
  //   return result;
  // }

  @Get()
  findAll(@Query() query: any) {
    return this.blogsQueryRepository.findAllBlogsForSa(pagination(query));
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   const result = await this.blogsQueryRepository.findOne(id);
  //   if (!result) {
  //     throw new HttpException({}, 404);
  //   }
  //   return result;
  // }
  //
  // @UseGuards(SpecialBearerAuthGuard)
  // @Get(':blogId/posts')
  // async findOneByBlogId(
  //   @Param('blogId') blogId: string,
  //   @Query() query: any,
  //   @CurrentUserId() currentUserId: string,
  // ) {
  //   const result = await this.postsQueryRepository.findOneByBlogId(
  //     blogId,
  //     pagination(query),
  //     currentUserId,
  //   );
  //   if (!result) {
  //     throw new HttpException({}, 404);
  //   }
  //   return result;
  // }

  @Put(':id/bind-with-user/:userId')
  @HttpCode(204)
  async updateBlogsBindWithUser(
    @Param() model: IdModelType,
    @CurrentUserId() currentUserId,
  ) {
    const resultFound = await this.blogsQueryRepository.findBlogById(model.id);
    if (!resultFound || resultFound.blogOwnerInfo.userId) {
      throw new BadRequestException([
        { message: 'blogId Not Found', filed: 'blogId' },
      ]);
    }

    const user = await this.usersQueryRepository.findUsersById(model.userId);
    if (!user) {
      throw new BadRequestException([
        { message: 'userId Not Found', filed: 'userId' },
      ]);
    }
    return this.blogsService.updatePostsOnNewUser(user.login, model);
  }

  @Put(':id/ban')
  @HttpCode(204)
  async updateBanBlogs(
    @Param('id') id: string,
    @Body() inputModel: BanBlogsInputModel,
  ) {
    const blog = await this.blogsService.banBlogs(id, inputModel.isBanned);
    // if (blog) return;
    return;
  }
  //
  // @Delete(':id')
  // @HttpCode(204)
  // @UseGuards(BasicAuthGuard)
  // async delete(@Param('id') id: string) {
  //   const result = await this.commandBus.execute(new DeleteBlogCommand(id));
  //   if (!result) {
  //     throw new HttpException({}, 404);
  //   }
  //   return result;
  // }
  //
  // @Delete()
  // @HttpCode(204)
  // async deleteAll() {
  //   return await this.commandBus.execute(new DeleteAllBlogsCommand());
  // }
}
