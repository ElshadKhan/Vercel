import { IsBoolean, Length, Validate } from 'class-validator';

export class BanBLoggerUsersInputModel {
  @IsBoolean()
  isBanned: boolean;
  @Length(20)
  banReason: string;
  @Validate(BloggerExistsRule)
  blogId: string;
}
