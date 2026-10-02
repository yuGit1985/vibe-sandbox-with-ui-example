export type EmailMessage = {
  to: string;
  subject: string;
  body: string;
};

export type SentEmail = EmailMessage & {
  id: string;
  sentAt: string;
};

export interface EmailSender {
  send(message: EmailMessage): SentEmail;
}
