import {
  commentatorInfoType,
  postInfoType,
} from '../../domain/entities/NO_SQL_entitity/comment.entity';

export class CreateCommentDbType {
  id: string;
  content: string;
  createdAt: string;
  commentatorInfo: commentatorInfoType;
  postInfo: postInfoType;
  isBanned: boolean;
}
