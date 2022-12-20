import {
  commentatorInfoType,
  postInfoType,
} from '../../domain/entities/comment.entity';

export class CreateCommentDbType {
  id: string;
  content: string;
  createdAt: string;
  commentatorInfo: commentatorInfoType;
  postInfo: postInfoType;
  isBan: boolean;
}
