import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersQueryRepository } from './users.queryRepository';
import { pagination } from '../middleware/queryValidation';
import { CreateUserInputModelType } from './domain/userTypes';

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
  createUser(@Body() inputModel: CreateUserInputModelType) {
    return this.usersService.createUser(inputModel);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }

  @Delete()
  @HttpCode(204)
  deleteAllUsers() {
    return this.usersService.deleteAllUsers();
  }

  // @Put(":id")
  // updateUser(@Param("id") userId: string, @Body() inputModel: CreateUserInputModelType): object {
  //   return this.usersService.updateUser(userId, inputModel.name, inputModel.childrenCount);
  // }
}
