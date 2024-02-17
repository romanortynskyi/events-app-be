import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createTransport } from 'nodemailer'
import * as path from 'path'
const EmailTemplates = require('email-templates')

import { EMAIL_NOT_SENT, TEMPLATE_NOT_FOUND } from 'src/enums/error-messages'
import { templateList } from 'src/emails'

@Injectable()
class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(options) {
    const { email, subject, language, text } = options

    const templateToSend = templateList[subject][language]

    if (!templateToSend) {
      throw new NotFoundException(TEMPLATE_NOT_FOUND)
    }

    const emailTemplates = new EmailTemplates({
      views: {
        root: path.resolve('src', 'emails'),
      },
    })

    const html = await emailTemplates.render(templateToSend.template, text)

    try {
      const transporter = createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          user: this.configService.get('MAILER_USER'),
          pass: this.configService.get('MAILER_PASSWORD'),
        },
        tls: {
          rejectUnauthorized: false,
        },
      })

      const optionsToSend = {
        from: 'EventsApp',
        to: email,
        subject: templateToSend.subject,
        html,
      }

      await transporter.sendMail(optionsToSend)
      transporter.close()
    } catch (err) {
      console.error(err)
      throw new InternalServerErrorException(EMAIL_NOT_SENT)
    }
  }
}

export default EmailService
