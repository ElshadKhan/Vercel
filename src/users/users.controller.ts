import {Body, Controller, Delete, Get, HttpCode, Param, Post, Query} from '@nestjs/common';
import {CreateUserInputModelType, UsersService} from "./users.service";
import {UsersQueryRepository} from "./users.queryRepository";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService,
              private usersQueryRepository: UsersQueryRepository) {}

  @Get()
  getUsers(@Query() query: { term: string }): object {
    return this.usersQueryRepository.getUsers(query.term);
  }

  @Get(":id")
  getUser(@Param("id") userId: string): object {
    return this.usersQueryRepository.getUser(userId);
  }

  @Post()
  createUser(@Body() inputModel: CreateUserInputModelType) {
    return this.usersService.createUser(inputModel);
  }

  @Delete(":id")
  @HttpCode(204)
  deleteUser(@Param("id") userId: string): object {
    return this.usersService.deleteUser(userId);
  }

  // @Put(":id")
  // updateUser(@Param("id") userId: string, @Body() inputModel: CreateUserInputModelType): object {
  //   return this.usersService.updateUser(userId, inputModel.name, inputModel.childrenCount);
  // }
}

