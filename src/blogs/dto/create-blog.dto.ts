import { IsString, IsUrl, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateBlogDto {
  @IsString()
  @Length(1, 15)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @IsString()
  @Length(1, 500)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  @IsString()
  @Length(1, 100)
  @IsUrl()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  websiteUrl: string;
}

export class CreateBlogDbType {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
  ) {}
}

export class BlogsBusinessType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: Array<CreateBlogDbType>,
  ) {}
}
