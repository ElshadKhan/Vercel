import { LikeStatusEnam } from './like-enam.dto';

export class LikeDbType {
  constructor(
    public type: LikeStatusEnam,
    public userId: string,
    public parentId: string,
    public login: string,
    public createdAt: string,
    public isBan: boolean,
  ) {}
}
