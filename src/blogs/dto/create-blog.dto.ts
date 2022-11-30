import { IsUrl, Length } from 'class-validator';

export class CreateBlogDto {
  @Length(1, 15)
  name: string;
  @Length(1, 500)
  description: string;
  @Length(1, 100)
  @IsUrl()
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
