import { IsBoolean, Length } from 'class-validator';

export class BanUserInputModel {
  @IsBoolean()
  isBanned: boolean;
  @Length(20)
  banReason: string;
}

export class BanUserInputUseCaseType {
  id: string;
  isBanned: boolean;
  banReason: string;
}

export class BanUsersFactory {
  constructor(
    public id: string,
    public isBanned: boolean,
    public banDate: string,
    public banReason: string,
  ) {}
}
