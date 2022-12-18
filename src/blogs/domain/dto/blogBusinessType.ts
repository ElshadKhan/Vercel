import { CreateBlogDtoType } from './createBlogDbType';

export class BlogsBusinessType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: Array<CreateBlogDtoType>,
  ) {}
}
