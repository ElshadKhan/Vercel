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
