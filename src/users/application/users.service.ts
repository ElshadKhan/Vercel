import { Injectable, Scope } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { CreateUserDto } from '../api/dto/create-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { PasswordService } from '../../helpers/password/password.service';
import { UserAccountDBType } from '../domain/dto/user.account.dto';
import { UsersQueryRepository } from '../infrastructure/users.queryRepository';
import { BanBLoggerUsersInputModel } from '../api/dto/ban-bloger-users-input-dto';
import { BanUserInputModel } from '../api/dto/update-user-banStatus-dto';

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
    private passwordService: PasswordService,
  ) {}

  // async create(inputModel: CreateUserDto) {
  //   const passwordHash = await this.passwordService.generateSaltAndHash(
  //     inputModel.password,
  //   );
  //   const newUser = new UserAccountDBType(
  //     String(+new Date()),
  //     {
  //       login: inputModel.login,
  //       email: inputModel.email,
  //       passwordHash,
  //       createdAt: new Date().toISOString(),
  //     },
  //     {
  //       confirmationCode: uuidv4(),
  //       expirationDate: add(new Date(), { hours: 1, minutes: 1 }),
  //       isConfirmed: false,
  //     },
  //     {
  //       confirmationCode: uuidv4(),
  //       expirationDate: add(new Date(), { hours: 2, minutes: 2 }),
  //       isConfirmed: false,
  //     },
  //     {
  //       isBanned: false,
  //       banDate: null,
  //       banReason: null,
  //     },
  //   );
  //   return await this.usersRepository.create(newUser);
  // }

  // async updateUsers(id: string, inputModel: BanUserInputModel) {
  //   if (inputModel.isBanned) {
  //     const newUser = new BanUsersFactory(
  //       id,
  //       inputModel.isBanned,
  //       new Date().toISOString(),
  //       inputModel.banReason,
  //     );
  //
  //     await this.sessionService.deleteUserDevices(newUser.id);
  //     await this.userRepository.updateUsers(newUser);
  //     await this.blogsRepository.banUsers(newUser.id, inputModel.isBanned);
  //     await this.postsRepository.banUsers(newUser.id, inputModel.isBanned);
  //     await this.commentsRepository.banUsers(newUser.id, inputModel.isBanned);
  //
  //     return newUser;
  //   } else {
  //     const newUser = new BanUsersFactory(id, inputModel.isBanned, null, null);
  //
  //     await this.userRepository.updateUsers(newUser);
  //     await this.blogsRepository.banUsers(newUser.id, inputModel.isBanned);
  //     await this.postsRepository.banUsers(newUser.id, inputModel.isBanned);
  //     await this.commentsRepository.banUsers(newUser.id, inputModel.isBanned);
  //
  //     return newUser;
  //   }
  // }

  // async banBloggerUsers(
  //   banUserId: string,
  //   bloggerId: string,
  //   model: BanBLoggerUsersInputModel,
  // ) {
  //   const user = await this.usersQueryRepository.findUserById(banUserId);
  //   if (!user) return false;
  //   if (model.isBanned) {
  //     const newBanUser = new BanBloggerUsersFactory(
  //       String(+new Date()),
  //       model.blogId,
  //       bloggerId,
  //       banUserId,
  //       user.accountData.login,
  //       {
  //         isBanned: model.isBanned,
  //         banDate: new Date().toISOString(),
  //         banReason: model.banReason,
  //       },
  //     );
  //
  //     await this.usersRepository.banBloggerUsers(newBanUser);
  //
  //     return newBanUser;
  //   } else {
  //     // const newBanUser = new BanUsersFactory(id, model.isBanned, null, null);
  //     await this.usersRepository.unbanBloggerUsers(banUserId, bloggerId);
  //
  //     // await this.userRepository.updateUsers(newBanUser);
  //     // await this.blogsRepository.banUsers(newBanUser.id, model.isBanned);
  //     // await this.postsRepository.banUsers(newBanUser.id, model.isBanned);
  //     // await this.commentsRepository.banUsers(newBanUser.id, model.isBanned);
  //
  //     return true;
  //   }
  // }

  // delete(userId: string) {
  //   return this.usersRepository.delete(userId);
  // }
  //
  // deleteAll() {
  //   return this.usersRepository.deleteAll();
  // }
}
