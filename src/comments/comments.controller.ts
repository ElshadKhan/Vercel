import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  HttpException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsQueryRepository } from './comments.queryRepository';
import { LikesService } from '../likes/likes.service';
import { LikesDto } from '../likes/dto/like-enam.dto';
import { BearerAuthGuard } from '../auth/guards/bearer.auth.guard';
import { SpecialBearerAuthGuard } from '../auth/guards/special.bearer.auth.guard';
import { CreateCommentType } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
    private readonly likesService: LikesService,
  ) {}
  @UseGuards(SpecialBearerAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    console.log('1', id);
    console.log('2', req.user);
    const result = await this.commentsQueryRepository.findCommentById(
      id,
      req.user,
    );
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @Put(':commentId')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  async update(
    @Body() inputModel: CreateCommentType,
    @Param('commentId') commentId: string,
    @Req() req,
  ) {
    const comment = await this.commentsQueryRepository.findCommentById(
      commentId,
    );
    if (!comment) {
      throw new HttpException({}, 404);
    }
    if (comment.userId !== req.user.id) {
      throw new HttpException({}, 403);
    }
    return this.commentsService.update(commentId, inputModel.content);
  }

  @Put(':commentId/like-status')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  async updateLikeStatus(
    @Param('commentId') commentId: string,
    @Body() likesStatus: LikesDto,
    @Req() req,
  ) {
    const comment =
      await this.commentsQueryRepository.findCommentByUserIdAndCommentId(
        commentId,
        req.user,
      );
    if (comment) {
      return this.likesService.updateLikeStatus(
        likesStatus.likeStatus,
        commentId,
        req.user.id,
      );
    } else {
      throw new HttpException({}, 404);
    }
  }
  @Delete(':commentId')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  async delete(@Param('commentId') commentId: string, @Req() req) {
    const comment = await this.commentsQueryRepository.findCommentById(
      commentId,
    );
    if (!comment && comment.userId !== req.user.id) {
      throw new HttpException({}, 403);
    }
    return this.commentsService.delete(commentId);
  }

  @Delete()
  @HttpCode(204)
  deleteAll() {
    return this.commentsService.deleteAll();
  }
}
