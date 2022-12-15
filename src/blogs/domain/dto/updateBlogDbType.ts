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
  id: string;
  userId: string;
  userLogin: string;
}
