import { LikeStatusEnam } from './like-enam.dto';

export class CommentsLikeDbType {
  constructor(
    public type: LikeStatusEnam,
    public userId: string,
    public commentId: string,
    public login: string,
    public createdAt: string,
    public isBanned: boolean,
  ) {}
}

export class PostsLikeDbType {
  constructor(
    public type: LikeStatusEnam,
    public userId: string,
    public postId: string,
    public login: string,
    public createdAt: string,
    public isBanned: boolean,
  ) {}
}
