export type { EmailMessage, EmailSender } from './types';
export { createSesSender, type SesConfig } from './ses';
export {
  type EmailContent,
  verificationEmail,
  passwordResetEmail,
  orderReceiptEmail,
} from './templates';
