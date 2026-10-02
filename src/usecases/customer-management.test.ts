import { describe, expect, it } from "vitest";
import type { Clock } from "@/ports/clock";
import type {
  Customer,
  CustomerNote,
  CustomerRepository,
} from "@/ports/customer-repository";
import { CustomerManagement } from "./customer-management";

const sampleCustomer: Customer = {
  id: "1",
  name: "佐藤 美咲",
  nameKana: "さとう みさき",
  company: "テスト株式会社",
  department: "営業部",
  title: "部長",
  email: "test@example.com",
  phone: "00-0000-0000",
  status: "active",
  owner: "田中",
  lastContactedAt: "2026-10-01",
  nextAction: "連絡する",
  initials: "SM",
  accent: "mint",
  notes: [],
};

class TestRepository implements CustomerRepository {
  customer = { ...sampleCustomer, notes: [] as CustomerNote[] };

  list(): Customer[] {
    return [this.customer];
  }

  findById(id: string): Customer | undefined {
    return id === this.customer.id ? this.customer : undefined;
  }

  addNote(_customerId: string, note: CustomerNote): Customer {
    this.customer = { ...this.customer, notes: [note] };
    return this.customer;
  }
}

const clock: Clock = { today: () => "2026-10-03" };

describe("CustomerManagement", () => {
  it("名前または読み仮名で顧客を検索する", () => {
    const service = new CustomerManagement(new TestRepository(), clock);
    expect(service.listCustomers("佐藤")).toHaveLength(1);
    expect(service.listCustomers("みさき")).toHaveLength(1);
    expect(service.listCustomers("鈴木")).toHaveLength(0);
  });

  it("空白を除いたメモを追加する", () => {
    const service = new CustomerManagement(new TestRepository(), clock);
    const customer = service.addNote("1", "  来週フォローする  ", "田中");
    expect(customer.notes[0]).toMatchObject({
      body: "来週フォローする",
      author: "田中",
      createdAt: "2026-10-03",
    });
  });

  it("連続して追加したメモに異なるIDを付ける", () => {
    const service = new CustomerManagement(new TestRepository(), clock);
    const first = service.addNote("1", "最初のメモ", "田中");
    const second = service.addNote("1", "次のメモ", "田中");
    expect(second.notes[0]?.id).not.toBe(first.notes[0]?.id);
  });

  it("空のメモを拒否する", () => {
    const service = new CustomerManagement(new TestRepository(), clock);
    expect(() => service.addNote("1", "   ", "田中")).toThrow(
      "メモを入力してください。",
    );
  });
});
