import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  HttpException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.queryRepository';
import { LikesDto } from '../../likes/domain/dto/like-enam.dto';
import { BearerAuthGuard } from '../../auth/guards/bearer.auth.guard';
import { SpecialBearerAuthGuard } from '../../auth/guards/special.bearer.auth.guard';
import { CreateCommentType } from './dto/createCommentDto';
import { CurrentUserId } from '../../auth/current-user-id.param.decorator';
import { CommentUpdateUseCaseDtoType } from '../application/dto/commentUpdateUseCaseDtoType';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/use-cases/update-comment-use-case';
import { DeleteCommentCommand } from '../application/use-cases/delete-comment-use-case';
import { DeleteAllCommentsCommand } from '../application/use-cases/delete-all-comments-use-case';
import { UpdateCommentLikesCommand } from '../../likes/application/use-cases/update-comment-likes-use-case';
import { CommentLikesUseCasesDtoType } from '../../likes/domain/dto/commentLikesUseCasesDtoType';
import { SqlCommentsQueryRepository } from '../infrastructure/sql.comments.queryRepository';

@Controller('comments')
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private commentsQueryRepository: SqlCommentsQueryRepository,
  ) {}

  @UseGuards(SpecialBearerAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const result = await this.commentsQueryRepository.findCommentById(
      id,
      req.user?.id,
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
    const inputDto: CommentUpdateUseCaseDtoType = {
      id: commentId,
      content: inputModel.content,
    };
    return this.commandBus.execute(new UpdateCommentCommand(inputDto));
  }

  @Put(':commentId/like-status')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  async updateLikeStatus(
    @Param('commentId') commentId: string,
    @Body() likesStatus: LikesDto,
    @CurrentUserId() currentUserId: string,
  ) {
    const useCaseDto: CommentLikesUseCasesDtoType = {
      likesStatus: likesStatus.likeStatus,
      commentId: commentId,
      userId: currentUserId,
    };
    const comment =
      await this.commentsQueryRepository.findCommentByUserIdAndCommentId(
        commentId,
        currentUserId,
      );
    if (comment) {
      return this.commandBus.execute(new UpdateCommentLikesCommand(useCaseDto));
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
    return this.commandBus.execute(new DeleteCommentCommand(commentId));
  }

  @Delete()
  @HttpCode(204)
  deleteAll() {
    return this.commandBus.execute(new DeleteAllCommentsCommand());
  }
}
