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
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.queryRepository';
import {
  pagination,
  QueryValidationType,
} from '../../helpers/middleware/queryValidation';
import { CommentsService } from '../../comments/application/comments.service';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.queryRepository';
import { LikesService } from '../../likes/application/likes.service';
import { LikesDto } from '../../likes/domain/dto/like-enam.dto';
import { BasicAuthGuard } from '../../auth/guards/basic.auth.guard';
import { BearerAuthGuard } from '../../auth/guards/bearer.auth.guard';
import { SpecialBearerAuthGuard } from '../../auth/guards/special.bearer.auth.guard';
import { UpdatePostDtoBlogId } from './dto/update-post.dto';
import { CreatePostDtoWithBlogId } from './dto/createPostWithBlogIdDto';
import { CreateCommentType } from '../../comments/api/dto/createCommentDto';
import { CurrentUserId } from '../../auth/current-user-id.param.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../../comments/application/use-cases/create-comment-use-case';
import { CommentCreateUseCaseDtoType } from '../../comments/application/dto/commentCreateUseCaseDtoType';
import { UpdateLikesCommand } from '../../likes/application/use-cases/update-likes-use-case';
import { LikesUseCasesDtoType } from '../../likes/domain/dto/likesUseCasesDtoType';

@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
    private readonly likesService: LikesService,
  ) {}
  @UseGuards(SpecialBearerAuthGuard)
  @Post()
  @UseGuards(BasicAuthGuard)
  async create(@Body() createPostDto: CreatePostDtoWithBlogId) {
    return await this.postsService.create(
      createPostDto.title,
      createPostDto.shortDescription,
      createPostDto.content,
      createPostDto.blogId,
    );
  }

  @Post(':postId/comments')
  @UseGuards(BearerAuthGuard)
  async createComment(
    @Body() inputParameter: CreateCommentType,
    @Param('postId') postId: string,
    @CurrentUserId() currentUserId: string,
  ) {
    const inputModel: CommentCreateUseCaseDtoType = {
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
  async findOne(
    @Param('id') id: string,
    @CurrentUserId() currentUserId: string,
  ) {
    const result = await this.postsQueryRepository.findOne(id, currentUserId);

    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdatePostDtoBlogId,
  ) {
    const result = await this.postsService.update(id, updateBlogDto);
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
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
      const useCaseDto: LikesUseCasesDtoType = {
        likesStatus: likesStatus.likeStatus,
        parentId: postId,
        userId: currentUserId,
      };
      return this.commandBus.execute(new UpdateLikesCommand(useCaseDto));
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
