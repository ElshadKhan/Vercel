import { IsEmail } from 'class-validator';

export class ResendingDto {
  @IsEmail()
  email: string;
}
