import { IsEnum } from 'class-validator';
export enum LikeStatusEnam {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export class LikesDto {
  @IsEnum(LikeStatusEnam)
  likeStatus: LikeStatusEnam;
}
