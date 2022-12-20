import { CreateBlogDtoType, CreateSaBlogDtoType } from './createBlogDbType';

export class BlogsBusinessType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: Array<CreateBlogDtoType>,
  ) {}
}

export class SaBlogsBusinessType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: Array<CreateSaBlogDtoType>,
  ) {}
}
