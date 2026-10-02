import { describe, expect, it } from "vitest";
import type {
  Customer,
  CustomerNote,
  CustomerRepository,
} from "@/ports/customer-repository";
import type { EmailMessage, EmailSender } from "@/ports/email-sender";
import { CustomerEmail } from "./customer-email";

const customer: Customer = {
  id: "c-001",
  name: "佐藤 美咲",
  nameKana: "さとう みさき",
  company: "テスト株式会社",
  department: "営業部",
  title: "部長",
  email: "misaki@example.com",
  phone: "00-0000-0000",
  status: "active",
  rank: "S",
  owner: "田中",
  lastContactedAt: "2026-10-01",
  nextAction: "連絡する",
  initials: "SM",
  accent: "mint",
  notes: [],
};

class TestCustomerRepository implements CustomerRepository {
  list(): Customer[] {
    return [customer];
  }

  findById(id: string): Customer | undefined {
    return id === customer.id ? customer : undefined;
  }

  addNote(_customerId: string, _note: CustomerNote): Customer {
    return customer;
  }
}

class TestEmailSender implements EmailSender {
  lastMessage: EmailMessage | undefined;

  send(message: EmailMessage) {
    this.lastMessage = message;
    return { ...message, id: "email-1", sentAt: "2026-10-03T09:00:00Z" };
  }
}

describe("CustomerEmail", () => {
  it("顧客のメールアドレスへ件名と本文を送信する", () => {
    const sender = new TestEmailSender();
    const useCase = new CustomerEmail(new TestCustomerRepository(), sender);

    const sentEmail = useCase.send(
      "c-001",
      "  お打ち合わせのお礼  ",
      "  本日はありがとうございました。  ",
    );

    expect(sender.lastMessage).toEqual({
      to: "misaki@example.com",
      subject: "お打ち合わせのお礼",
      body: "本日はありがとうございました。",
    });
    expect(sentEmail.id).toBe("email-1");
  });

  it.each([
    ["", "本文", "件名を入力してください。"],
    ["件名", "   ", "本文を入力してください。"],
  ])("必須項目が空の場合は送信しない", (subject, body, message) => {
    const sender = new TestEmailSender();
    const useCase = new CustomerEmail(new TestCustomerRepository(), sender);

    expect(() => useCase.send("c-001", subject, body)).toThrow(message);
    expect(sender.lastMessage).toBeUndefined();
  });

  it("存在しない顧客への送信を拒否する", () => {
    const useCase = new CustomerEmail(
      new TestCustomerRepository(),
      new TestEmailSender(),
    );

    expect(() => useCase.send("unknown", "件名", "本文")).toThrow(
      "顧客が見つかりませんでした。",
    );
  });
});
