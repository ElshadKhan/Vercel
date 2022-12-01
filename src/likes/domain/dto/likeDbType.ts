import { LikeStatusEnam } from './like-enam.dto';

export class LikeDbType {
  constructor(
    public parentId: string,
    public userId: string,
    public login: string,
    public type: LikeStatusEnam,
    public createdAt: string,
  ) {}
}
