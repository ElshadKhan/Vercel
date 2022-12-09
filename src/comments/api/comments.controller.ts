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
import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../infrastructure/comments.queryRepository';
import { LikesService } from '../../likes/application/likes.service';
import { LikesDto } from '../../likes/domain/dto/like-enam.dto';
import { BearerAuthGuard } from '../../auth/guards/bearer.auth.guard';
import { SpecialBearerAuthGuard } from '../../auth/guards/special.bearer.auth.guard';
import { CreateCommentType } from './dto/createCommentDto';
import { CurrentUserId } from '../../auth/current-user-id.param.decorator';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
    private readonly likesService: LikesService,
  ) {}
  @UseGuards(SpecialBearerAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUserId() currentUserId: string,
  ) {
    const result = await this.commentsQueryRepository.findCommentById(
      id,
      currentUserId,
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
    @CurrentUserId() currentUserId: string,
  ) {
    const comment = await this.commentsQueryRepository.findCommentById(
      commentId,
    );
    if (!comment) {
      throw new HttpException({}, 404);
    }
    if (comment.userId !== currentUserId) {
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
    @CurrentUserId() currentUserId: string,
  ) {
    const comment =
      await this.commentsQueryRepository.findCommentByUserIdAndCommentId(
        commentId,
        currentUserId,
      );
    if (comment) {
      return this.likesService.updateLikeStatus(
        likesStatus.likeStatus,
        commentId,
        currentUserId,
      );
    } else {
      throw new HttpException({}, 404);
    }
  }
  @Delete(':commentId')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  async delete(
    @Param('commentId') commentId: string,
    @CurrentUserId() currentUserId: string,
  ) {
    const comment = await this.commentsQueryRepository.findCommentById(
      commentId,
    );
    if (!comment) {
      throw new HttpException({}, 404);
    }
    if (comment.userId !== currentUserId) {
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
