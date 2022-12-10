import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UsersQueryRepository } from '../../../users/infrastructure/users.queryRepository';
import { CommandHandler } from '@nestjs/cqrs';

export class EmailConfirmationCommand {
  constructor(public code: string) {}
}

@CommandHandler(EmailConfirmationCommand)
export class EmailConfirmationUseCase {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: EmailConfirmationCommand): Promise<boolean> {
    const user =
      await this.usersQueryRepository.findUserByEmailConfirmationCode(
        command.code,
      );
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;

    const result = await this.usersRepository.updateEmailConfirmation(user.id);
    return result;
  }
}
