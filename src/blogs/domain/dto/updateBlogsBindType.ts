import { IsBoolean, Validate } from 'class-validator';
import { BlogExistsRule } from '../../../helpers/middleware/blogIdValidator';
import { UserExistsRule } from '../../../helpers/middleware/userIdValidator';

export class IdModelType {
  @Validate(BlogExistsRule)
  id: string;

  @Validate(UserExistsRule)
  userId: string;
}

export class BanBlogsInputModel {
  @IsBoolean()
  isBanned: boolean;
}

export class BanBlogsFactory {
  constructor(
    public blogId: string,
    public isBanned: boolean,
    public banDate: string,
  ) {}
}

export class BanBlogsRepoDto {
  blogId: string;
  isBanned: boolean;
  banDate: string;
}
export class BanBlogUseCaseDto {
  blogId: string;
  isBanned: boolean;
}
