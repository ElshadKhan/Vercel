import { EmailManagers } from '../../../helpers/managers/emailManagers';
import { CreateUserDto } from '../../../users/api/dto/create-user.dto';
import { CommandHandler } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../../users/application/use-cases/create-user-use-case';

export class RegistrationUserCommand {
  constructor(public inputModel: CreateUserDto) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase {
  constructor(
    private commandBus: CommandBus,
    private emailManager: EmailManagers,
  ) {}

  async execute(command: RegistrationUserCommand) {
    const newUser = await this.commandBus.execute(
      new CreateUserCommand(command.inputModel),
    );
    const result = await this.emailManager.sendEmailConfirmationMessage(
      newUser,
    );
    return result;
  }
}
