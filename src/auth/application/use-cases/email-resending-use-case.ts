import { UsersQueryRepository } from '../../../users/infrastructure/users.queryRepository';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailManagers } from '../../../helpers/managers/emailManagers';
import { CommandHandler } from '@nestjs/cqrs';
import { SqlUsersQueryRepository } from '../../../users/infrastructure/sql.users.queryRepository';

export class EmailResendingCommand {
  constructor(public email: string) {}
}

@CommandHandler(EmailResendingCommand)
export class EmailResendingUseCase {
  constructor(
    private usersQueryRepository: SqlUsersQueryRepository,
    private usersRepository: UsersRepository,
    private emailManager: EmailManagers,
  ) {}

  async execute(command: EmailResendingCommand) {
    const user = await this.usersQueryRepository.findUserByLoginOrEmail(
      command.email,
    );
    if (
      !user ||
      user.emailConfirmation.isConfirmed ||
      user.emailConfirmation.expirationDate < new Date()
    )
      return false;
    const code = randomUUID();
    await this.usersRepository.updateEmailResendingCode(user.id, code);
    await this.emailManager.emailResendingConfirmationMessage(
      command.email,
      code,
    );
    return user;
  }
}
