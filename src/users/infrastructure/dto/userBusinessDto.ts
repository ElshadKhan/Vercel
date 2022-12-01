export type UserDto = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
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
