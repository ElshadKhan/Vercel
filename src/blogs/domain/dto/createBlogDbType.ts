export class BlogOwnerInfoType {
  constructor(public userId: string, public userLogin: string) {}
}
export class BanInfoType {
  constructor(public isBanned: boolean, public banDate: string) {}
}

export class CreateBlogDbType {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public blogOwnerInfo: BlogOwnerInfoType,
    public banInfo: BanInfoType,
  ) {}
}

export class CreateBlogDtoType {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
  ) {}
}
