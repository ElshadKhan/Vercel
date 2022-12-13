import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';

export class DeleteAllUsersCommand {}

@CommandHandler(DeleteAllUsersCommand)
export class DeleteAllUsersUseCase
  implements ICommandHandler<DeleteAllUsersCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute() {
    return await this.usersRepository.deleteAll();
  }
}
