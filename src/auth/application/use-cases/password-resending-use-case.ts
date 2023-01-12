import { UsersQueryRepository } from '../../../users/infrastructure/users.queryRepository';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { PasswordManagers } from '../../../helpers/managers/passwordManagers';
import { CommandHandler } from '@nestjs/cqrs';
import { SqlUsersQueryRepository } from '../../../users/infrastructure/sql.users.queryRepository';

export class PasswordResendingCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordResendingCommand)
export class PasswordResendingUseCase {
  constructor(
    private usersQueryRepository: SqlUsersQueryRepository,
    private usersRepository: UsersRepository,
    private passwordManager: PasswordManagers,
  ) {}

  async execute(command: PasswordResendingCommand) {
    const user = await this.usersQueryRepository.findUserByLoginOrEmail(
      command.email,
    );
    if (
      !user ||
      user.passwordConfirmation.isConfirmed ||
      user.passwordConfirmation.expirationDate < new Date().toISOString()
    )
      return null;
    const code = randomUUID();
    await this.usersRepository.updatePasswordResendingCode(user.id, code);
    await this.passwordManager.passwordResendingConfirmationMessage(
      command.email,
      code,
    );
    return user;
  }
}
