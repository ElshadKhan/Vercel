import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAdapter {
  async sendEmail(email: string, code: string) {
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
        ' <h1>Thank for your registration</h1>\n' +
        '       <p>To finish registration please follow the link below:\n' +
        `<a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>\n` +
        '      </p>',
    });
    return info.messageId;
  }
}
