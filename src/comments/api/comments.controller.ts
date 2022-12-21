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
import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../infrastructure/comments.queryRepository';
import { LikesService } from '../../likes/application/likes.service';
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
import { UpdateLikesCommand } from '../../likes/application/use-cases/update-likes-use-case';
import { LikesUseCasesDtoType } from '../../likes/domain/dto/likesUseCasesDtoType';

@Controller('comments')
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
    private likesService: LikesService,
  ) {}

  @UseGuards(SpecialBearerAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    console.log('1');
    const result = await this.commentsQueryRepository.findCommentById(
      id,
      req.user?.id,
    );
    console.log('result', result);
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
    const useCaseDto: LikesUseCasesDtoType = {
      likesStatus: likesStatus.likeStatus,
      parentId: commentId,
      userId: currentUserId,
    };
    const comment =
      await this.commentsQueryRepository.findCommentByUserIdAndCommentId(
        commentId,
        currentUserId,
      );
    if (comment) {
      return this.commandBus.execute(new UpdateLikesCommand(useCaseDto));
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
