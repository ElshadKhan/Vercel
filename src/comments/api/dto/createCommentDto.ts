import { Length } from 'class-validator';

export class CreateCommentType {
  @Length(20, 300)
  content: string;
}
