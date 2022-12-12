import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentUpdateUseCaseDtoType } from '../dto/commentUpdateUseCaseDtoType';

export class UpdateCommentCommand {
  constructor(public inputDto: CommentUpdateUseCaseDtoType) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentCommand) {
    return this.commentsRepository.update(
      command.inputDto.id,
      command.inputDto.content,
    );
  }
}
