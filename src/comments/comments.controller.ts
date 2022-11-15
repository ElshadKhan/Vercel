import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsQueryRepository } from './comments.queryRepository';
import { UserDbType } from '../users/entities/users.entity';
import { UserAccountDBType } from '../users/dto/user.db';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { pagination } from '../middleware/queryValidation';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Post(':postId')
  create(@Body() content, @Param('postId') postId: string) {
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
    return this.commentsService.create(content, postId, newUser);
  }

  @Get(':postId/comments')
  findCommentsByPostId(@Query() query: any, @Param('postId') postId: string) {
    return this.commentsQueryRepository.findCommentsByPostIdAndUserId(
      postId,
      pagination(query),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsQueryRepository.findCommentById(id);
  }

  @Patch(':id')
  update(@Body() content, @Param('id') id: string) {
    return this.commentsService.update(content, id);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.commentsService.delete(id);
  }

  @Delete()
  @HttpCode(204)
  deleteAll() {
    return this.commentsService.deleteAll();
  }
}
