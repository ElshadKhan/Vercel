import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsQueryRepository } from '../infrastructure/posts.queryRepository';
import {
  pagination,
  QueryValidationType,
} from '../../helpers/middleware/queryValidation';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.queryRepository';
import { LikesDto } from '../../likes/domain/dto/like-enam.dto';
import { BearerAuthGuard } from '../../auth/guards/bearer.auth.guard';
import { SpecialBearerAuthGuard } from '../../auth/guards/special.bearer.auth.guard';
import { CreateCommentType } from '../../comments/api/dto/createCommentDto';
import { CurrentUserId } from '../../auth/current-user-id.param.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../../comments/application/use-cases/create-comment-use-case';
import { PostLikesUseCasesDtoType } from '../../likes/domain/dto/commentLikesUseCasesDtoType';
import { UsersQueryRepository } from '../../users/infrastructure/users.queryRepository';
import { SqlUsersQueryRepository } from '../../users/infrastructure/sql.users.queryRepository';
import { UpdatePostLikesCommand } from '../../likes/application/use-cases/update-post-likes-use-case';
import { SqlPostsQueryRepository } from '../infrastructure/sql.posts.queryRepository';

@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private postsQueryRepository: SqlPostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private usersQueryRepository: SqlUsersQueryRepository,
  ) {}

  @Post(':postId/comments')
  @UseGuards(BearerAuthGuard)
  async createComment(
    @Body() inputParameter: CreateCommentType,
    @Param('postId') postId: string,
    @CurrentUserId() currentUserId: string,
  ) {
    const post = await this.postsQueryRepository.findPostById(postId);

    const permission = await this.usersQueryRepository.getBanUserForBlog(
      currentUserId,
      post.blogId,
    );
    if (permission) {
      throw new HttpException('Forbidden', 403);
    }
    const inputModel = {
      content: inputParameter.content,
      userId: currentUserId,
      postId: postId,
    };
    const result = await this.commandBus.execute(
      new CreateCommentCommand(inputModel),
    );
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @UseGuards(SpecialBearerAuthGuard)
  @Get(':postId/comments')
  async findCommentsByPostId(
    @Query() query: QueryValidationType,
    @Param('postId') postId: string,
    @CurrentUserId() currentUserId: string,
  ) {
    const result =
      await this.commentsQueryRepository.findCommentsByPostIdAndUserId(
        postId,
        pagination(query),
        currentUserId,
      );
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @UseGuards(SpecialBearerAuthGuard)
  @Get()
  findAll(
    @Query() query: QueryValidationType,
    @CurrentUserId() currentUserId: string,
  ) {
    return this.postsQueryRepository.findAll(pagination(query), currentUserId);
  }

  @UseGuards(SpecialBearerAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    if (!req.user) {
      const result = await this.postsQueryRepository.findOne(id, req.user);

      if (!result) {
        throw new HttpException({}, 404);
      }
      return result;
    } else {
      const result = await this.postsQueryRepository.findOne(id, req.user.id);

      if (!result) {
        throw new HttpException({}, 404);
      }
      return result;
    }
  }

  @Put(':postId/like-status')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  async updateLikeStatus(
    @Param('postId') postId: string,
    @Body() likesStatus: LikesDto,
    @CurrentUserId() currentUserId: string,
  ) {
    const post = await this.postsQueryRepository.findOne(postId, currentUserId);
    if (post) {
      const useCaseDto: PostLikesUseCasesDtoType = {
        likesStatus: likesStatus.likeStatus,
        postId: postId,
        userId: currentUserId,
      };
      return this.commandBus.execute(new UpdatePostLikesCommand(useCaseDto));
    } else {
      throw new HttpException({}, 404);
    }
  }
}
