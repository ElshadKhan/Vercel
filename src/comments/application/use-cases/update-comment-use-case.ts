import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentUpdateUseCaseDtoType } from '../dto/commentUpdateUseCaseDtoType';
import { SqlCommentsRepository } from '../../infrastructure/sql.comments.repository';

export class UpdateCommentCommand {
  constructor(public inputDto: CommentUpdateUseCaseDtoType) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepository: SqlCommentsRepository) {}

  async execute(command: UpdateCommentCommand) {
    return this.commentsRepository.update(
      command.inputDto.id,
      command.inputDto.content,
    );
  }
}
