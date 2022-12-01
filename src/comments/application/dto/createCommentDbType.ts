import { LikesInfoType } from '../../domain/dto/likeInfoType';

export class CreateCommentDbType {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  postId: string;
  createdAt: string;
  likesInfo: LikesInfoType;
}
