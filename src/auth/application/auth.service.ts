import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UsersQueryRepository } from '../../users/infrastructure/users.queryRepository';
import { PasswordService } from '../../helpers/password/password.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { CreateUserDto } from '../../users/api/dto/create-user.dto';
import { EmailManagers } from '../../helpers/managers/emailManagers';
import { PasswordManagers } from '../../helpers/managers/passwordManagers';
import { LoginUserDto } from '../domain/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
    private passwordService: PasswordService,
    private emailManager: EmailManagers,
    private passwordManager: PasswordManagers,
  ) {}
}

// async validateUser(loginOrEmail: string, password: string): Promise<any> {
//   const user = await this.usersQueryRepository.findUserByLoginOrEmail(
//     loginOrEmail,
//   );
//   if (!user || user.banInfo.isBanned) return false;
//   const isValid = await bcrypt.compare(
//     password,
//     user.accountData.passwordHash,
//   );
//   if (!isValid) return false;
//   return user;
// }

// async registration(inputModel: CreateUserDto) {
//   const newUser = await this.usersService.create(inputModel);
//   const result = await this.emailManager.sendEmailConfirmationMessage(
//     newUser,
//   );
//   return result;
// }

// async emailResending(email: string) {
//   const user = await this.usersQueryRepository.findUserByLoginOrEmail(email);
//   if (
//     !user ||
//     user.emailConfirmation.isConfirmed ||
//     user.emailConfirmation.expirationDate < new Date()
//   )
//     return false;
//   const code = randomUUID();
//   await this.usersRepository.updateEmailResendingCode(user.id, code);
//   await this.emailManager.emailResendingConfirmationMessage(email, code);
//   return user;
// }

// async passwordResending(email: string) {
//   const user = await this.usersQueryRepository.findUserByLoginOrEmail(email);
//   if (
//     !user ||
//     user.passwordConfirmation.isConfirmed ||
//     user.passwordConfirmation.expirationDate < new Date()
//   )
//     return null;
//   const code = randomUUID();
//   await this.usersRepository.updatePasswordResendingCode(user.id, code);
//   await this.passwordManager.passwordResendingConfirmationMessage(
//     email,
//     code,
//   );
//   return user;
// }

// async confirmationEmail(code: string): Promise<boolean> {
//   const user =
//     await this.usersQueryRepository.findUserByEmailConfirmationCode(code);
//   if (!user) return false;
//   if (user.emailConfirmation.isConfirmed) return false;
//   if (user.emailConfirmation.expirationDate < new Date()) return false;
//
//   const result = await this.usersRepository.updateEmailConfirmation(user.id);
//   return result;
// }

// async confirmationPassword(
//   newPassword: string,
//   recoveryCode: string,
// ): Promise<boolean> {
//   const user =
//     await this.usersQueryRepository.findUserByPasswordConfirmationCode(
//       recoveryCode,
//     );
//   if (!user) return false;
//   if (user.passwordConfirmation.isConfirmed) return false;
//   if (user.passwordConfirmation.expirationDate < new Date()) return false;
//
//   const passwordHash = await this.passwordService.generateSaltAndHash(
//     newPassword,
//   );
//
//   await this.usersRepository.updatePasswordConfirmation(user.id);
//   await this.usersRepository.updatePassword(user.id, passwordHash);
//
//   return true;
// }

// async checkCredentials(inputModel: LoginUserDto) {
//   const user = await this.usersQueryRepository.findUserByLoginOrEmail(
//     inputModel.loginOrEmail,
//   );
//   if (!user) return false;
//   const isValid = await bcrypt.compare(
//     inputModel.password,
//     user.accountData.passwordHash,
//   );
//   if (!isValid) {
//     return false;
//   }
//   return user;
// }
