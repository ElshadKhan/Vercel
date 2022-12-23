import { IsBoolean } from 'class-validator';

export class UpdateBlogDbType {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {}
}

export class UpdateBlogOnNewUser {
  id: string;
  userId: string;
}

export class UpdateBlogOnNewUserRepo {
  blogId: string;
  userId: string;
  userLogin: string;
}

export class BanBlogsInputModelType {
  @IsBoolean()
  isBanned: boolean;
}
