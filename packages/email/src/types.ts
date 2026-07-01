export interface EmailMessage {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  /** overrides the sender's default From (must be a verified SES identity) */
  from?: string;
}

export interface EmailSender {
  send(msg: EmailMessage): Promise<void>;
}
