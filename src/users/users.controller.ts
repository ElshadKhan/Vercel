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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersQueryRepository } from './users.queryRepository';
import { pagination } from '../middleware/queryValidation';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  getUsers(@Query() query: any) {
    return this.usersQueryRepository.getUsers(pagination(query));
  }

  @Get(':id')
  getUser(@Param('id') userId: string) {
    return this.usersQueryRepository.getUser(userId);
  }

  @Post()
  createUser(@Body() inputModel: CreateUserDto) {
    return this.usersService.create(inputModel);
  }

  @Delete(':id')
  @HttpCode(204)
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

  // @Put(":id")
  // updateUser(@Param("id") userId: string, @Body() inputModel: CreateUserInputModelType): object {
  //   return this.usersService.updateUser(userId, inputModel.name, inputModel.childrenCount);
  // }
}
