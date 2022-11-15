import { SortDirection } from '../../middleware/queryValidation';

export class CreateCommentDbType {
  constructor(
    public id: string,
    public content: string,
    public userId: string,
    public userLogin: string,
    public postId: string,
    public createdAt: string,
    public likesInfo: LikesInfoType,
  ) {}
}

export class CreateCommentType {
  constructor(public content: string) {}
}

export class CommentDtoType {
  constructor(
    public id: string,
    public content: string,
    public userId: string,
    public userLogin: string,
    public createdAt: string,
    public likesInfo: LikesInfoType,
  ) {}
}

export class LikesInfoType {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public myStatus: string,
  ) {}
}

export class QueryCommentType {
  constructor(
    public pageNumber: number,
    public pageSize: number,
    public sortBy: string,
    public sortDirection: SortDirection,
  ) {}
}

export class CommentsBusinessType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: Array<CommentDtoType>,
  ) {}
}
