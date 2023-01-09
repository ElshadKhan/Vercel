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
import {
  BanUserInputModel,
  BanUserInputUseCaseType,
} from './dto/update-user-banStatus-dto';
import { UpdateUserCommand } from '../application/use-cases/update-user-use-case';
import { BanUsersBusinessType } from './dto/create.user.buisnes.type';
import { SqlUsersQueryRepository } from '../infrastructure/sql.users.queryRepository';

@UseGuards(BasicAuthGuard)
@Controller('sa/users')
export class SaUsersController {
  constructor(
    private commandBus: CommandBus,
    private usersService: UsersService,
    private usersQueryRepository: SqlUsersQueryRepository,
  ) {}

  @Get()
  getUsers(@Query() query: any) {
    return this.usersQueryRepository.getUsersForSa(pagination(query));
  }

  @Post()
  async createUser(@Body() inputModel: CreateUserDto) {
    const user = await this.commandBus.execute(
      new CreateUserCommand(inputModel),
    );
    const newUser = new BanUsersBusinessType(
      user.id,
      user.accountData.login,
      user.accountData.email,
      user.accountData.createdAt,
      {
        isBanned: user.banInfo.isBanned,
        banDate: user.banInfo.banDate,
        banReason: user.banInfo.banReason,
      },
    );

    return newUser;
  }

  @Put(':id/ban')
  @HttpCode(204)
  async updateUserStatus(
    @Param('id') id: string,
    @Body() inputModel: BanUserInputModel,
  ) {
    const useCaseDto: BanUserInputUseCaseType = {
      id: id,
      isBanned: inputModel.isBanned,
      banReason: inputModel.banReason,
    };
    const user = await this.commandBus.execute(
      new UpdateUserCommand(useCaseDto),
    );
    if (user) return;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') userId: string) {
    const result = await this.commandBus.execute(new DeleteUserCommand(userId));
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }
}
