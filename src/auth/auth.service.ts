import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { UsersQueryRepository } from '../users/users.queryRepository';
import { PasswordService } from '../password/password.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { EmailManagers } from './managers/emailManagers';
import { PasswordManagers } from './managers/passwordManagers';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private userRepository: UsersRepository,
    private userQueryRepository: UsersQueryRepository,
    private passwordService: PasswordService,
    private emailManager: EmailManagers,
    private passwordManager: PasswordManagers,
  ) {}

  async create(inputModel: CreateUserDto) {
    const newUser = await this.userService.create(inputModel);
    const result = await this.emailManager.sendEmailConfirmationMessage(
      newUser,
    );
    return result;
  }

  async emailResending(email: string) {
    const user = await this.userQueryRepository.findUserByLoginOrEmail(email);
    if (!user) return null;
    const code = randomUUID();
    await this.userRepository.updateEmailResendingCode(user.id, code);
    await this.emailManager.emailResendingConfirmationMessage(email, code);
    return user;
  }

  async passwordResending(email: string) {
    const user = await this.userQueryRepository.findUserByLoginOrEmail(email);
    if (!user) return null;
    const code = randomUUID();
    await this.userRepository.updatePasswordResendingCode(user.id, code);
    await this.passwordManager.passwordResendingConfirmationMessage(
      email,
      code,
    );
    return user;
  }

  async confirmationEmail(code: string): Promise<boolean> {
    const user = await this.userQueryRepository.findUserByEmailConfirmationCode(
      code,
    );
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.confirmationCode !== code) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;

    const result = await this.userRepository.updateEmailConfirmation(user.id);
    return result;
  }

  async confirmationPassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<boolean> {
    const user =
      await this.userQueryRepository.findUserByPasswordConfirmationCode(
        recoveryCode,
      );
    if (!user) return false;
    if (user.passwordConfirmation.isConfirmed) return false;
    if (user.passwordConfirmation.confirmationCode !== recoveryCode)
      return false;
    if (user.passwordConfirmation.expirationDate < new Date()) return false;

    const passwordHash = await this.passwordService.generateSaltAndHash(
      newPassword,
    );

    await this.userRepository.updatePasswordConfirmation(user.id);
    await this.userRepository.updatePassword(user.id, passwordHash);

    return true;
  }

  async checkCredentials(inputModel: LoginUserDto) {
    const user = await this.userQueryRepository.findUserByLoginOrEmail(
      inputModel.loginOrEmail,
    );
    if (!user) return false;
    const isValid = await bcrypt.compare(
      inputModel.password,
      user.accountData.passwordHash,
    );
    if (!isValid) {
      return false;
    }
    return user;
  }
}
