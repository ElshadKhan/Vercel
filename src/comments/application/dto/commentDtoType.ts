import { LikesInfoType } from '../../domain/dto/likeInfoType';

export class CommentDtoType {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
  likesInfo: LikesInfoType;
}
