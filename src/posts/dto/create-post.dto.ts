import { IsString, Length, Validate } from 'class-validator';
import { BlogExistsRule } from '../validators/blogIdValidator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreatePostDto {
  @IsString()
  @Length(1, 30)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @IsString()
  @Length(1, 100)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shortDescription: string;

  @IsString()
  @Length(1, 1000)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  content: string;
}

export class CreatePostDtoBlogId {
  @IsString()
  @Length(1, 30)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @IsString()
  @Length(1, 100)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shortDescription: string;

  @IsString()
  @Length(1, 1000)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  content: string;

  @Validate(BlogExistsRule)
  blogId: string;
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
