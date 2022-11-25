import { Length } from 'class-validator';

export class PasswordConfirmationCodeDto {
  @Length(6, 20)
  newPassword: string;
  recoveryCode: string;
}
