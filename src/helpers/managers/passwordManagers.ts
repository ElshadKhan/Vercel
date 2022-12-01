import { PasswordAdapter } from '../adapters/passwordAdapter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordManagers {
  constructor(private passwordAdapter: PasswordAdapter) {}
  async passwordResendingConfirmationMessage(email: string, code: string) {
    const userMessage = await this.passwordAdapter.sendPassword(email, code);
    return userMessage;
  }
}
