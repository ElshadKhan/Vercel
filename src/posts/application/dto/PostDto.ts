export class PostDbType {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string | null,
    public createdAt: string,
    public userId: string,
  ) {}
}

export class PostDtoType {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string | null,
    public createdAt: string,
    public extendedLikesInfo: ExtendedLikesInfoType,
  ) {}
}

export class ExtendedLikesInfoType {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public myStatus: string,
    public newestLikes: Array<NewestLikesType>,
  ) {}
}
export class NewestLikesType {
  constructor(
    public addedAt: string,
    public userId: string,
    public login: string,
  ) {}
}
