import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAccountDBType } from './dto/user.db';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private configService: ConfigService,
    private passwordService: PasswordService,
  ) {}

  private jwtSecret = this.configService.get<string>('JWT_SECRET');
  // getUsers(term: string) {
  //     return this.usersRepository.getUsers(term);
  // }
  // getUser(userId: string) {
  //     return this.usersRepository.getUser(userId);
  // }
  async create(inputModel: CreateUserDto) {
    const { passwordSalt, passwordHash } =
      await this.passwordService.generateSaltAndHash(inputModel.password);
    const newUser = new UserAccountDBType(
      String(+new Date()),
      {
        login: inputModel.login,
        email: inputModel.email,
        passwordHash,
        passwordSalt,
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1, minutes: 1 }),
        isConfirmed: false,
      },
      {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 2, minutes: 2 }),
        isConfirmed: false,
      },
    );
    await this.usersRepository.create(newUser);
    return {
      id: newUser.id,
      login: newUser.accountData.login,
      email: newUser.accountData.email,
      createdAt: newUser.accountData.createdAt,
    };
  }

  delete(userId: string) {
    return this.usersRepository.delete(userId);
  }

  deleteAll() {
    return this.usersRepository.deleteAll();
  }

  // updateUser(userId: string, name: string, childrenCount: number) {
  //     return this.usersRepository.updateUser(userId, name, childrenCount);
  // }
}
