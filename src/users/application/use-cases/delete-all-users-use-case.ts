import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { SqlUsersRepository } from '../../infrastructure/sql.users.repository';

export class DeleteAllUsersCommand {}

@CommandHandler(DeleteAllUsersCommand)
export class DeleteAllUsersUseCase
  implements ICommandHandler<DeleteAllUsersCommand>
{
  constructor(private usersRepository: SqlUsersRepository) {}

  async execute() {
    return await this.usersRepository.deleteAll();
  }
}
