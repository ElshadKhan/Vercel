export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export class QueryValidationType {
  constructor(
    public pageNumber: number,
    public pageSize: number,
    public sortBy: string,
    public sortDirection: SortDirection,
    public searchNameTerm: string,
    public searchLoginTerm: string,
    public searchEmailTerm: string,
    public banStatus: boolean,
  ) {}
}

const defaultPageSize = 10;
const defaultPageNumber = 1;
const defaultBanStatus = 'NOT NULL';

export const pagination = (query: any): QueryValidationType => {
  let pageNumber = query.pageNumber;
  const parsedPageNumber = parseInt(pageNumber, 10);
  if (!pageNumber || !parsedPageNumber || parsedPageNumber <= 0)
    pageNumber = defaultPageNumber;
  pageNumber = parseInt(pageNumber, 10);

  let pageSize = query.pageSize;
  const parsedPageSize = parseInt(pageSize, 10);
  if (!pageSize || !parsedPageSize || parsedPageSize <= 0) {
    pageSize = defaultPageSize;
  }
  pageSize = parseInt(pageSize, 10);
  let banStatus = query.banStatus;
  if (!banStatus || banStatus === 'all') {
    banStatus = defaultBanStatus;
  } else {
    if (banStatus === 'banned') {
      banStatus = true;
    }
    if (banStatus === 'notBanned') {
      banStatus = false;
    }
  }

  const sortBy = typeof query.sortBy === 'string' ? query.sortBy : 'createdAt';
  const sortDirection =
    typeof query.sortDirection === 'string' ? query.sortDirection : 'desc';
  const searchNameTerm =
    typeof query.searchNameTerm === 'string'
      ? query.searchNameTerm?.toString()
      : '';
  const searchLoginTerm =
    typeof query.searchLoginTerm === 'string'
      ? query.searchLoginTerm?.toString()
      : '';
  const searchEmailTerm =
    typeof query.searchEmailTerm === 'string'
      ? query.searchEmailTerm?.toString()
      : '';
  return {
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    searchNameTerm,
    searchLoginTerm,
    searchEmailTerm,
    banStatus,
  };
};
