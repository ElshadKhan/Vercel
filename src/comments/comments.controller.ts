import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsQueryRepository } from './comments.queryRepository';
import { LikesService } from '../likes/likes.service';
import { LikeStatusEnam } from '../likes/dto/like-enam.dto';
import { UserAccountDBType } from '../users/dto/user.db';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
    private readonly likesService: LikesService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsQueryRepository.findCommentById(id);
  }

  @Put(':id')
  update(@Body() content, @Param('id') id: string) {
    return this.commentsService.update(content, id);
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
    const comment =
      await this.commentsQueryRepository.findCommentByUserIdAndCommentId(
        id,
        user,
      );
    if (comment) {
      return this.likesService.updateLikeStatus(likesStatus, id, user.id);
    } else {
      throw new HttpException({}, 404);
    }
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
