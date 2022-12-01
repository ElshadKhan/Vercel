import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordAdapter {
  async sendPassword(email: string, code: string) {
    const transport = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'khanakhmedov.elshad@gmail.com',
        pass: 'jywuqaepczorwvso',
      },
    });
    const info = await transport.sendMail({
      from: 'Elshad <khanakhmedov.elshad@gmail.com>',
      to: email,
      subject: `Back-end`,
      html:
        ' <h1>Password recovery</h1>\n' +
        '       <p>To finish password recovery please follow the link below:\n' +
        `<a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>\n` +
        '      </p>',
    });
    return info.messageId;
  }
}
