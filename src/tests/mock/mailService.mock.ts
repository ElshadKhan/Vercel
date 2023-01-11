export class MailServiceMock {
  constructor(e) {}

  async sendUserConfirmation(email: string, code: string) {
    return true;
  }

  async sendPasswordRecoveryMessage(email: string, code: string) {
    return true;
  }

  async sendEmailRecoveryMessage(email: string, code: string) {
    return true;
  }
}
