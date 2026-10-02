import type { CustomerRepository } from "@/ports/customer-repository";
import type { EmailSender, SentEmail } from "@/ports/email-sender";

export class CustomerEmail {
  constructor(
    private readonly customers: CustomerRepository,
    private readonly sender: EmailSender,
  ) {}

  send(customerId: string, subject: string, body: string): SentEmail {
    const customer = this.customers.findById(customerId);
    if (!customer) {
      throw new Error("顧客が見つかりませんでした。");
    }

    const normalizedSubject = subject.trim();
    const normalizedBody = body.trim();
    if (!normalizedSubject) {
      throw new Error("件名を入力してください。");
    }
    if (!normalizedBody) {
      throw new Error("本文を入力してください。");
    }

    return this.sender.send({
      to: customer.email,
      subject: normalizedSubject,
      body: normalizedBody,
    });
  }
}
