import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { SqlUsersRepository } from '../../infrastructure/sql.users.repository';

export class DeleteUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private usersRepository: SqlUsersRepository) {}

  async execute(command: DeleteUserCommand) {
    return await this.usersRepository.delete(command.userId);
  }
}
