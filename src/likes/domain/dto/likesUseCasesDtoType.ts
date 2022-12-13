import { LikeStatusEnam } from './like-enam.dto';

export class LikesUseCasesDtoType {
  constructor(
    public parentId: string,
    public userId: string,
    public likesStatus: LikeStatusEnam,
  ) {}
}
