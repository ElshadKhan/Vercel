import { LikesInfoType } from '../../domain/dto/likeInfoType';

export class CommentDtoType {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
  likesInfo: LikesInfoType;
}

export class CommentBusinessDtoType {
  id: string;
  content: string;
  createdAt: string;
  likesInfo: LikesInfoType;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  postInfo: {
    id: string;
    title: string;
    blogId: string;
    blogName: string;
  };
}
