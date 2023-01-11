import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UsersQueryRepository } from '../../../users/infrastructure/users.queryRepository';
import { PasswordService } from '../../../helpers/password/password.service';
import { PasswordConfirmationCodeDto } from '../../domain/dto/password.confirmation.code.dto';
import { CommandHandler } from '@nestjs/cqrs';
import { SqlUsersQueryRepository } from '../../../users/infrastructure/sql.users.queryRepository';

export class PasswordConfirmationCommand {
  constructor(public inputModel: PasswordConfirmationCodeDto) {}
}

@CommandHandler(PasswordConfirmationCommand)
export class PasswordConfirmationUseCase {
  constructor(
    private usersQueryRepository: SqlUsersQueryRepository,
    private usersRepository: UsersRepository,
    private passwordService: PasswordService,
  ) {}

  async execute(command: PasswordConfirmationCommand): Promise<boolean> {
    const user =
      await this.usersQueryRepository.findUserByPasswordConfirmationCode(
        command.inputModel.recoveryCode,
      );
    if (!user) return false;
    if (user.passwordConfirmation.isConfirmed) return false;
    if (user.passwordConfirmation.expirationDate < new Date()) return false;

    const passwordHash = await this.passwordService.generateSaltAndHash(
      command.inputModel.newPassword,
    );

    await this.usersRepository.updatePasswordConfirmation(user.id);
    await this.usersRepository.updatePassword(user.id, passwordHash);

    return true;
  }
}
