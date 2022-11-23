import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { PasswordService } from '../password/password.service';
import { UserAccountDBType } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private configService: ConfigService,
    private passwordService: PasswordService,
  ) {}

  private jwtSecret = this.configService.get<string>('JWT_SECRET');

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
