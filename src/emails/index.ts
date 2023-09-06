import EmailSubject from 'src/enums/email-subject'

export const templateList = {
  [EmailSubject.ResetPassword]: {
    en: {
      subject: 'Reset your account password',
      template: 'en/reset-password',
    },
    ua: {
      subject: 'Скиньте пароль для свого акаунту',
      template: 'ua/reset-password',
    },
  },
}
