import { Length } from 'class-validator';

export class LoginUserDto {
  @Length(3, 10)
  login: string;

  @Length(6, 20)
  password: string;
}
