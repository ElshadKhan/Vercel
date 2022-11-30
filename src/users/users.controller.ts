import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersQueryRepository } from './users.queryRepository';
import { pagination } from '../middleware/queryValidation';
import { CreateUserDto } from './dto/create-user.dto';
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
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
    const findUserByLogin =
      await this.usersQueryRepository.findUserByLoginOrEmail(inputModel.login);
    if (findUserByEmail || findUserByLogin) {
      throw new HttpException({}, 400);
    }
    const newUser = await this.usersService.create(inputModel);
    return {
      id: newUser.id,
      login: newUser.accountData.login,
      email: newUser.accountData.email,
      createdAt: newUser.accountData.createdAt,
    };
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deleteUser(@Param('id') userId: string) {
    const result = await this.usersService.delete(userId);
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }

  @Delete()
  @HttpCode(204)
  deleteAllUsers() {
    return this.usersService.deleteAll();
  }
}
