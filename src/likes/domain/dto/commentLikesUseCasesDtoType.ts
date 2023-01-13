import { LikeStatusEnam } from './like-enam.dto';

export class CommentLikesUseCasesDtoType {
  constructor(
    public commentId: string,
    public userId: string,
    public likesStatus: LikeStatusEnam,
  ) {}
}

export class PostLikesUseCasesDtoType {
  constructor(
    public postId: string,
    public userId: string,
    public likesStatus: LikeStatusEnam,
  ) {}
}
