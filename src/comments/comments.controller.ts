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
import { LikesDto, LikeStatusEnam } from '../likes/dto/like-enam.dto';
import { BearerAuthGuard } from '../auth/guards/bearer.auth.guard';
import { SpecialBearerAuthGuard } from '../auth/guards/special.bearer.auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
    private readonly likesService: LikesService,
  ) {}
  @UseGuards(SpecialBearerAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.commentsQueryRepository.findCommentById(id, req.user);
  }

  @Put(':commentId')
  @UseGuards(BearerAuthGuard)
  update(@Body() content, @Param('commentId') commentId: string) {
    return this.commentsService.update(content, commentId);
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
  delete(@Param('commentId') commentId: string) {
    return this.commentsService.delete(commentId);
  }

  @Delete()
  @HttpCode(204)
  deleteAll() {
    return this.commentsService.deleteAll();
  }
}
