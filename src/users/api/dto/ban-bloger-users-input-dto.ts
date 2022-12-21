import { IsBoolean, Length, Validate } from 'class-validator';
import { BlogExistsRule } from '../../../helpers/middleware/blogIdValidator';
import { BanInfoType } from '../../domain/dto/user.account.dto';

export class BanBLoggerUsersInputModel {
  @IsBoolean()
  isBanned: boolean;
  @Length(20)
  banReason: string;
  @Validate(BlogExistsRule)
  blogId: string;
}

export class BanBloggerUsersModel {
  constructor(
    public id: string,
    public blogId: string,
    public bloggerId: string,
    public banUserId: string,
    public login: string,
    public banInfo: BanInfoType,
  ) {}
}

export class BanUsersUseCaseType {
  bloggerId: string;
  banUserId: string;
  isBanned: boolean;
  banReason: string;
  blogId: string;
}
