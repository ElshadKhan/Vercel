import { CommentDtoType } from '../../application/dto/commentDtoType';

export class CommentsBusinessType {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<CommentDtoType>;
}
