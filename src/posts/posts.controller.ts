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
import { PostsService } from './posts.service';
import { CreatePostDtoBlogId } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsQueryRepository } from './posts.queryRepository';
import { pagination, QueryValidationType } from '../middleware/queryValidation';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentDbType } from '../comments/dto/create-comment.dto';
import { CommentsQueryRepository } from '../comments/comments.queryRepository';
import { LikesService } from '../likes/likes.service';
import { LikesDto, LikeStatusEnam } from '../likes/dto/like-enam.dto';
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';
import { BearerAuthGuard } from '../auth/guards/bearer.auth.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
    private readonly likesService: LikesService,
  ) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  async create(@Body() createPostDto: CreatePostDtoBlogId) {
    return await this.postsService.create(
      createPostDto.title,
      createPostDto.shortDescription,
      createPostDto.content,
      createPostDto.blogId,
    );
  }

  @Post(':postId/comments')
  @UseGuards(BearerAuthGuard)
  async createComment(
    @Body() content: CreateCommentDbType,
    @Param('postId') postId: string,
    @Req() req,
  ) {
    const result = await this.commentsService.create(
      content.content,
      postId,
      req.user,
    );
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @Get(':postId/comments')
  findCommentsByPostId(
    @Query() query: QueryValidationType,
    @Param('postId') postId: string,
  ) {
    return this.commentsQueryRepository.findCommentsByPostIdAndUserId(
      postId,
      pagination(query),
    );
  }

  @Get()
  findAll(@Query() query: QueryValidationType) {
    return this.postsQueryRepository.findAll(pagination(query));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.postsQueryRepository.findOne(id);
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdatePostDto) {
    const result = await this.postsService.update(id, updateBlogDto);
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }
  @Put(':id/like-status')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  async updateLikeStatus(
    @Param('id') id: string,
    @Body() likesStatus: LikesDto,
    @Req() req,
  ) {
    const post = await this.postsQueryRepository.findOne(id, req.user);
    if (post) {
      return this.likesService.updateLikeStatus(
        likesStatus.likesStatus,
        id,
        req.user.id,
      );
    } else {
      throw new HttpException({}, 404);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async delete(@Param('id') id: string) {
    const result = await this.postsService.delete(id);
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @Delete()
  @HttpCode(204)
  deleteAll() {
    return this.postsService.deleteAll();
  }
}
