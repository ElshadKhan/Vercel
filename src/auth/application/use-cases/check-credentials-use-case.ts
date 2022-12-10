import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../../domain/dto/login.dto';
import { UsersQueryRepository } from '../../../users/infrastructure/users.queryRepository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CheckCredentialsCommand {
  constructor(public inputModel: LoginUserDto) {}
}

@CommandHandler(CheckCredentialsCommand)
export class CheckCredentialsUseCase
  implements ICommandHandler<CheckCredentialsCommand>
{
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute(command: CheckCredentialsCommand) {
    const user = await this.usersQueryRepository.findUserByLoginOrEmail(
      command.inputModel.loginOrEmail,
    );
    if (!user) return false;
    const isValid = await bcrypt.compare(
      command.inputModel.password,
      user.accountData.passwordHash,
    );
    if (!isValid) {
      return false;
    }
    return user;
  }
}
