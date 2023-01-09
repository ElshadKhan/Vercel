import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../api/dto/create-user.dto';
import { UserAccountDBType } from '../../domain/dto/user.account.dto';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { UsersRepository } from '../../infrastructure/users.repository';
import { PasswordService } from '../../../helpers/password/password.service';
import { SqlUsersRepository } from '../../infrastructure/sql.users.repository';

export class CreateUserCommand {
  constructor(public inputModel: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private usersRepository: SqlUsersRepository,
    private passwordService: PasswordService,
  ) {}

  async execute(command: CreateUserCommand) {
    const passwordHash = await this.passwordService.generateSaltAndHash(
      command.inputModel.password,
    );
    const newUser = new UserAccountDBType(
      String(+new Date()),
      {
        login: command.inputModel.login,
        email: command.inputModel.email,
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
      {
        isBanned: false,
        banDate: null,
        banReason: null,
      },
    );
    return await this.usersRepository.create(newUser);
  }
}
