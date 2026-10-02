import type {
  EmailMessage,
  EmailSender,
  SentEmail,
} from "@/ports/email-sender";

export class InMemoryEmailSender implements EmailSender {
  private readonly sentEmails: SentEmail[] = [];

  send(message: EmailMessage): SentEmail {
    const email = {
      ...message,
      id: `email-${this.sentEmails.length + 1}`,
      sentAt: new Date().toISOString(),
    };
    this.sentEmails.push(email);
    return { ...email };
  }
}
