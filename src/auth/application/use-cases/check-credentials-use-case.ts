import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../../domain/dto/login.dto';
import { UsersQueryRepository } from '../../../users/infrastructure/users.queryRepository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SqlUsersQueryRepository } from '../../../users/infrastructure/sql.users.queryRepository';

export class CheckCredentialsCommand {
  constructor(public inputModel: LoginUserDto) {}
}

@CommandHandler(CheckCredentialsCommand)
export class CheckCredentialsUseCase
  implements ICommandHandler<CheckCredentialsCommand>
{
  constructor(private usersQueryRepository: SqlUsersQueryRepository) {}

  async execute(command: CheckCredentialsCommand) {
    const user = await this.usersQueryRepository.findUserByLoginOrEmail(
      command.inputModel.loginOrEmail,
    );
    console.log('user', user);
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
