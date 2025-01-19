import { BadRequestException, Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly email = process.env.MAILER_EMAIL;
  private readonly password = process.env.MAILER_PASSWORD;
  private readonly service = process.env.MAILER_SERVICE;

  private readonly transporter = createTransport({
    service: this.service,
    auth: {
      user: this.email,
      pass: this.password,
    },
  });

  sendMail(addressee: string, subject: string, content: string) {
    try {
      this.transporter.sendMail({
        from: this.email,
        to: addressee,
        subject,
        text: content,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async sendValidationCode(addressee: string, code: string) {
    try {
      await this.transporter.sendMail({
        from: this.email,
        to: addressee,
        subject: 'Email validation',
        html: `<div style="background-color: lightskyblue; font-family: arial; padding: 5px 10px;"><h1>Hello! This message was sent to validate your email!</h1>
                <p>Send this code in the validation_code field as a query param on the same endpoint</p>
                <p>The code will expire in 1 minute!</p>
                <h3 style="text-align: center;">${code}</h3></div>`,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
