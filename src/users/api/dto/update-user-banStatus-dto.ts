import { IsBoolean, Length } from 'class-validator';

export class BanUserInputModel {
  @IsBoolean()
  isBanned: boolean;
  @Length(20)
  banReason: string;
}
