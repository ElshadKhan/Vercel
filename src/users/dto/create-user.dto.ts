import { IsEmail, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateUserDto {
  @Length(3, 10)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  login: string;

  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string;

  @Length(6, 20)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
}
