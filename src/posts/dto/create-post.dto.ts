import { SortDirection } from '../../middleware/queryValidation';

export class CreatePostDto {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
  ) {}
}

export class CreatePostDtoBlogId {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
  ) {}
}

export class CreatePostDbType {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string | null,
    public createdAt: string,
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
export class QueryPostType {
  constructor(
    public pageNumber: number,
    public pageSize: number,
    public sortBy: string,
    public sortDirection: SortDirection,
  ) {}
}

export class PostsBusinessType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: Array<CreatePostDbType>,
  ) {}
}

export class PostsBusinessForBlogIdType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: Array<CreatePostDbType>,
  ) {}
}
