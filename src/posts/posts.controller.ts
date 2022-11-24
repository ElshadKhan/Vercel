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
import { PostsService } from './posts.service';
import { CreatePostDtoBlogId } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsQueryRepository } from './posts.queryRepository';
import { pagination, QueryValidationType } from '../middleware/queryValidation';
import { UserAccountDBType } from '../users/dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentDbType } from '../comments/dto/create-comment.dto';
import { CommentsQueryRepository } from '../comments/comments.queryRepository';
import { LikesService } from '../likes/likes.service';
import { LikeStatusEnam } from '../likes/dto/like-enam.dto';
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';

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
    const result = await this.postsService.create(
      createPostDto.title,
      createPostDto.shortDescription,
      createPostDto.content,
      createPostDto.blogId,
    );
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @Post(':postId/comments')
  async createComment(
    @Body() content: CreateCommentDbType,
    @Param('postId') postId: string,
  ) {
    const newUser = new UserAccountDBType(
      String(+new Date()),
      {
        login: 'login',
        email: 'inputModel.email@mail.ru',
        passwordHash: '',
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1, minutes: 1 }),
        isConfirmed: false,
      },
      {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 2, minutes: 2 }),
        isConfirmed: false,
      },
    );
    const result = await this.commentsService.create(
      content.content,
      postId,
      newUser,
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
  async updateLikeStatus(
    @Param('id') id: string,
    @Body() likesStatus: LikeStatusEnam,
  ) {
    const user = new UserAccountDBType(
      String(+new Date()),
      {
        login: 'login',
        email: 'inputModel.email@mail.ru',
        passwordHash: '',
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1, minutes: 1 }),
        isConfirmed: false,
      },
      {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 2, minutes: 2 }),
        isConfirmed: false,
      },
    );
    if (!user) {
      throw new HttpException({}, 401);
    }
    const post = await this.postsQueryRepository.findOne(id, user);
    if (post) {
      return this.likesService.updateLikeStatus(likesStatus, id, user.id);
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
