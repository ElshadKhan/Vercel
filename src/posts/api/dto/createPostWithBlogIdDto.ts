import { IsString, Length, Validate } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { BlogExistsRule } from '../../../helpers/middleware/blogIdValidator';

export class CreatePostDtoWithBlogId {
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
