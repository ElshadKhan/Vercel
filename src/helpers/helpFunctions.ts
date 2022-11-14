export const getSkipNumber = (pageNumber: number, pageSize: number) => {
  return (pageNumber - 1) * pageSize;
};

export const getPagesCounts = (totalCount: number, pageSize: number) => {
  return Math.ceil(totalCount / pageSize);
};

export enum LikeStatusEnam {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}
