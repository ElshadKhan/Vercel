import { BanInfoType } from "../../domain/dto/user.account.dto";

export class BanUsersBusinessType {
  constructor(
      public id: string,
      public login: string,
      public email: string,
      public createdAt: string,
      public isBanned: BanInfoType,
  ) {}
}
