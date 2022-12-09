import { Injectable, Scope } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { CreateUserDto } from '../api/dto/create-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { PasswordService } from '../../helpers/password/password.service';
import { UserAccountDBType } from '../domain/dto/user.account.dto';

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private passwordService: PasswordService,
  ) {}

  async create(inputModel: CreateUserDto) {
    const passwordHash = await this.passwordService.generateSaltAndHash(
      inputModel.password,
    );
    const newUser = new UserAccountDBType(
      String(+new Date()),
      {
        login: inputModel.login,
        email: inputModel.email,
        passwordHash,
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
    return await this.usersRepository.create(newUser);
  }

  delete(userId: string) {
    return this.usersRepository.delete(userId);
  }

  deleteAll() {
    return this.usersRepository.deleteAll();
  }
}
