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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDtoBlogId } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsQueryRepository } from './posts.queryRepository';
import { pagination } from '../middleware/queryValidation';
import { UserAccountDBType } from '../users/dto/user.db';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { CommentsService } from '../comments/comments.service';
import { CreateCommentDbType } from '../comments/dto/create-comment.dto';
import { CommentsQueryRepository } from '../comments/comments.queryRepository';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
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

  @Post(':postId/comments')
  createComment(
    @Body() content: CreateCommentDbType,
    @Param('postId') postId: string,
  ) {
    const newUser = new UserAccountDBType(
      String(+new Date()),
      {
        login: 'login',
        email: 'inputModel.email@mail.ru',
        passwordHash: '',
        passwordSalt: '',
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
    return this.commentsService.create(content.content, postId, newUser);
  }

  @Get(':postId/comments')
  findCommentsByPostId(@Query() query: any, @Param('postId') postId: string) {
    return this.commentsQueryRepository.findCommentsByPostIdAndUserId(
      postId,
      pagination(query),
    );
  }

  @Get()
  findAll(@Query() query: any) {
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
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdatePostDto) {
    const result = await this.postsService.update(id, updateBlogDto);
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @Delete(':id')
  @HttpCode(204)
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
