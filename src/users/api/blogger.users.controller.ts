import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/users.queryRepository';
import { pagination } from '../../helpers/middleware/queryValidation';
import { CommandBus } from '@nestjs/cqrs';
import {
  BanBLoggerUsersInputModel,
  BanUsersUseCaseType,
} from './dto/ban-bloger-users-input-dto';
import { UpdateBanBloggerUserCommand } from '../application/use-cases/update-banBlogerUser-use-case';
import { CurrentUserId } from '../../auth/current-user-id.param.decorator';
import { BearerAuthGuard } from '../../auth/guards/bearer.auth.guard';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.queryRepository';
import { SqlUsersQueryRepository } from '../infrastructure/sql.users.queryRepository';
import { SqlBlogsQueryRepository } from '../../blogs/infrastructure/sql.blogs.queryRepository';

@UseGuards(BearerAuthGuard)
@Controller('blogger/users')
export class BloggerUsersController {
  constructor(
    private commandBus: CommandBus,
    private usersQueryRepository: SqlUsersQueryRepository,
    private blogsQueryRepository: SqlBlogsQueryRepository,
  ) {}

  @Get('blog/:id')
  async getUsers(
    @Param('id') blogId: string,
    @CurrentUserId() currentUserId,
    @Query() query: any,
  ) {
    const resultFound = await this.blogsQueryRepository.findBlogById(blogId);
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    if (resultFound.blogOwnerInfo.userId !== currentUserId) {
      throw new HttpException('Forbidden', 403);
    }
    return this.usersQueryRepository.getBanUsersForBlog(
      currentUserId,
      blogId,
      pagination(query),
    );
  }

  @Put(':id/ban')
  @HttpCode(204)
  async banBloggerUsers(
    @Param('id') id: string,
    @Body() inputModel: BanBLoggerUsersInputModel,
    @CurrentUserId() currentUserId,
  ) {
    const resultFound = await this.blogsQueryRepository.findBlogById(
      inputModel.blogId,
    );
    if (!resultFound) {
      throw new HttpException('invalid blog', 404);
    }
    if (resultFound.blogOwnerInfo.userId !== currentUserId) {
      throw new HttpException('Forbidden', 403);
    }
    const useCaseDto: BanUsersUseCaseType = {
      bloggerId: currentUserId,
      banUserId: id,
      isBanned: inputModel.isBanned,
      banReason: inputModel.banReason,
      blogId: inputModel.blogId,
    };
    const user = await this.commandBus.execute(
      new UpdateBanBloggerUserCommand(useCaseDto),
    );
    if (!user) {
      throw new HttpException('invalid user', 404);
    }

    return;
  }
}
