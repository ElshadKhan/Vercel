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
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.queryRepository';
import { pagination } from '../../helpers/middleware/queryValidation';
import { PostsService } from '../../posts/application/posts.service';
import { CreatePostDto } from '../../posts/api/dto/createPostDto';
import {
  CreateBlogDto,
  CreateBlogUseCaseDto,
} from '../domain/dto/createBlogDto';
import { CurrentUserId } from '../../auth/current-user-id.param.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/use-cases/create-blog-use-case';
import { UpdateBlogCommand } from '../application/use-cases/update-blog-use-case';
import { UpdateBlogDbType } from '../domain/dto/updateBlogDbType';
import { DeleteBlogCommand } from '../application/use-cases/delete-blog-use-case';
import { CreatePostCommand } from '../../posts/application/use-cases/create-post-use-case';
import { BearerAuthGuard } from '../../auth/guards/bearer.auth.guard';
import {
  CreatePostUseCaseDto,
  UpdatePostUseCaseDto,
} from '../../posts/application/dto/createPostUseCaseDto';
import { UpdatePostCommand } from '../../posts/application/use-cases/update-post-use-case';
import { DeletePostCommand } from '../../posts/application/use-cases/delete-post-use-case';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.queryRepository';

@UseGuards(BearerAuthGuard)
@Controller('blogger/blogs')
export class BloggersController {
  constructor(
    private commandBus: CommandBus,
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  findAll(@Query() query: any, @CurrentUserId() currentUserId) {
    return this.blogsQueryRepository.findAllBloggerBlogs(
      pagination(query),
      currentUserId,
    );
  }

  @Get('comments')
  findAllComments(@Query() query: any, @CurrentUserId() currentUserId) {
    return this.commentsQueryRepository.findAllCommentsCurrentUser(
      pagination(query),
      currentUserId,
    );
  }

  @Post()
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @CurrentUserId() currentUserId,
  ) {
    const createUseCaseDto: CreateBlogUseCaseDto = {
      userId: currentUserId,
      name: createBlogDto.name,
      description: createBlogDto.description,
      websiteUrl: createBlogDto.websiteUrl,
    };
    const result = await this.commandBus.execute(
      new CreateBlogCommand(createUseCaseDto),
    );
    return {
      id: result.id,
      name: result.name,
      description: result.description,
      websiteUrl: result.websiteUrl,
      createdAt: result.createdAt,
    };
  }

  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() createPostDto: CreatePostDto,
    @CurrentUserId() currentUserId,
  ) {
    const resultFound = await this.blogsQueryRepository.findBlogById(blogId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    if (resultFound.blogOwnerInfo.userId !== currentUserId) {
      throw new HttpException('Forbidden', 403);
    }
    const useCaseDto: CreatePostUseCaseDto = {
      title: createPostDto.title,
      shortDescription: createPostDto.shortDescription,
      content: createPostDto.content,
      blogId: blogId,
      userId: currentUserId,
    };
    const post = await this.commandBus.execute(
      new CreatePostCommand(useCaseDto),
    );
    return post;
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: CreateBlogDto,
    @CurrentUserId() currentUserId,
  ) {
    const updateDto: UpdateBlogDbType = {
      id: id,
      name: updateBlogDto.name,
      description: updateBlogDto.description,
      websiteUrl: updateBlogDto.websiteUrl,
    };
    const resultFound = await this.blogsQueryRepository.findBlogById(id);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    if (resultFound.blogOwnerInfo.userId !== currentUserId) {
      throw new HttpException('Forbidden', 403);
    }
    const result = await this.commandBus.execute(
      new UpdateBlogCommand(updateDto),
    );
    return result;
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  async updatePost(
    @Param() { blogId, postId },
    @Body() updatePostDto: CreatePostDto,
    @CurrentUserId() currentUserId,
  ) {
    const blog = await this.blogsQueryRepository.findBlogById(blogId);
    if (!blog) {
      throw new HttpException('invalid blog', 404);
    }
    if (blog.blogOwnerInfo.userId !== currentUserId) {
      throw new HttpException('Forbidden', 403);
    }
    const useCaseDto: UpdatePostUseCaseDto = {
      postId: postId,
      title: updatePostDto.title,
      shortDescription: updatePostDto.shortDescription,
      content: updatePostDto.content,
      blogId: blogId,
    };
    const result = await this.commandBus.execute(
      new UpdatePostCommand(useCaseDto),
    );
    if (!result) {
      throw new HttpException({}, 404);
    }

    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string, @CurrentUserId() currentUserId) {
    const blog = await this.blogsQueryRepository.findBlogById(id);
    if (!blog) {
      throw new HttpException('invalid blog', 404);
    }
    if (blog.blogOwnerInfo.userId !== currentUserId) {
      throw new HttpException('Forbidden', 403);
    }
    return await this.commandBus.execute(new DeleteBlogCommand(id));
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deletePost(
    @Param() { blogId, postId },
    @CurrentUserId() currentUserId,
  ) {
    const blog = await this.blogsQueryRepository.findBlogById(blogId);
    if (!blog) {
      throw new HttpException('invalid blog', 404);
    }
    if (blog.blogOwnerInfo.userId !== currentUserId) {
      throw new HttpException('Forbidden', 403);
    }
    const result = await this.commandBus.execute(new DeletePostCommand(postId));
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }
}
