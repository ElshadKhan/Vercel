import { PostDtoType } from '../../application/dto/PostDto';

export class PostsBusinessType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: Array<PostDtoType>,
  ) {}
}
