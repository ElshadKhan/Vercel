import { UsersService } from '../../../users/application/users.service';
import { EmailManagers } from '../../../helpers/managers/emailManagers';
import { CreateUserDto } from '../../../users/api/dto/create-user.dto';
import { CommandHandler } from '@nestjs/cqrs';

export class RegistrationUserCommand {
  constructor(public inputModel: CreateUserDto) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase {
  constructor(
    private usersService: UsersService,
    private emailManager: EmailManagers,
  ) {}

  async execute(command: RegistrationUserCommand) {
    const newUser = await this.usersService.create(command.inputModel);
    const result = await this.emailManager.sendEmailConfirmationMessage(
      newUser,
    );
    return result;
  }
}
