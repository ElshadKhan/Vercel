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

@Controller('sa/users')
export class UsersSaController {
  constructor(
    private commandBus: CommandBus,
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
      banInfo: {
        isBanned: newUser.banInfo.isBanned,
        banDate: newUser.banInfo.banDate,
        banReason: newUser.banInfo.banReason,
      },
    };
  }

  @UseGuards(BasicAuthGuard)
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
  @UseGuards(BasicAuthGuard)
  async deleteUser(@Param('id') userId: string) {
    const result = await this.commandBus.execute(new DeleteUserCommand(userId));
    if (!result) {
      throw new HttpException({}, 404);
    }
    return result;
  }
}
