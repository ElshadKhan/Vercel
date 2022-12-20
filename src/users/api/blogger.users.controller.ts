import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../infrastructure/users.queryRepository';
import { pagination } from '../../helpers/middleware/queryValidation';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserCommand } from '../application/use-cases/create-user-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../auth/guards/basic.auth.guard';
import { DeleteUserCommand } from '../application/use-cases/delete-user-use-case';
import { BlogsQueryRepository } from 'src/blogs/infrastructure/blogs.queryRepository';
import {
  BanBLoggerUsersInputModel,
  BanUsersUseCaseType,
} from './dto/ban-bloger-users-input-dto';
import { CurrentUserId } from 'src/auth/current-user-id.param.decorator';
import { UpdateBanBloggerUserCommand } from '../application/use-cases/update-banBlogerUser-use-case';

@Controller('blogger/users')
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  @UseGuards(BasicAuthGuard)
  getUsers(@Query() query: any) {
    return this.usersQueryRepository.getUsers(pagination(query));
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createUser(@Body() inputModel: CreateUserDto) {
    const findUserByEmail =
      await this.usersQueryRepository.findUserByLoginOrEmail(inputModel.email);
    if (findUserByEmail) {
      throw new BadRequestException([
        {
          message: 'Email already exists',
          field: 'email',
        },
      ]);
    }
    const findUserByLogin =
      await this.usersQueryRepository.findUserByLoginOrEmail(inputModel.login);
    if (findUserByLogin) {
      throw new BadRequestException([
        {
          message: 'Login already exists',
          field: 'login',
        },
      ]);
    }
    const newUser = await this.commandBus.execute(
      new CreateUserCommand(inputModel),
    );
    return {
      id: newUser.id,
      login: newUser.accountData.login,
      email: newUser.accountData.email,
      createdAt: newUser.accountData.createdAt,
    };
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
      bloggerId: id,
      banUserId: currentUserId,
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

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deleteUser(@Param('id') userId: string) {
    const result = await this.commandBus.execute(new DeleteUserCommand(userId));
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }
}
