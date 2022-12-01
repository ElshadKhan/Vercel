import { CreatePostDbType } from '../../application/dto/createPostDb';

export class PostsBusinessType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: Array<CreatePostDbType>,
  ) {}
}
