import { BanInfoType } from '../../domain/dto/user.account.dto';

export type UserDto = {
  id: string;
  login: string;
  banInfo: BanInfoType;
};

export class UsersBusinessType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: Array<UserDto>,
  ) {}
}
