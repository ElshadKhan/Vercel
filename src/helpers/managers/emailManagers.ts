import { EmailAdapter } from '../adapters/emailAdapter';
import { Injectable } from '@nestjs/common';
import { UserAccountDBType } from '../../users/domain/dto/user.account.dto';

@Injectable()
export class EmailManagers {
  constructor(private emailAdapter: EmailAdapter) {}
  async sendEmailConfirmationMessage(user: UserAccountDBType) {
    const userMessage = await this.emailAdapter.sendEmail(
      user.accountData.email,
      user.emailConfirmation.confirmationCode,
    );
    return userMessage;
  }

  async emailResendingConfirmationMessage(email: string, code: string) {
    const userMessage = await this.emailAdapter.sendEmail(email, code);
    return userMessage;
  }
}
