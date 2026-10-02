import type { Clock } from "@/ports/clock";
import type {
  Customer,
  CustomerRepository,
  EditableCustomer,
} from "@/ports/customer-repository";

export class CustomerManagement {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly clock: Clock,
  ) {}

  listCustomers(query = ""): Customer[] {
    const normalizedQuery = query.trim().toLocaleLowerCase("ja");
    const customers = this.repository.list();
    if (!normalizedQuery) return customers;

    return customers.filter((customer) =>
      [customer.name, customer.nameKana].some((value) =>
        value.toLocaleLowerCase("ja").includes(normalizedQuery),
      ),
    );
  }

  getCustomer(id: string): Customer | undefined {
    return this.repository.findById(id);
  }

  updateCustomer(id: string, details: EditableCustomer): Customer {
    const normalizedDetails = {
      ...details,
      name: details.name.trim(),
      nameKana: details.nameKana.trim(),
      company: details.company.trim(),
      department: details.department.trim(),
      title: details.title.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
      owner: details.owner.trim(),
      lastContactedAt: details.lastContactedAt.trim(),
      nextAction: details.nextAction.trim(),
    };

    if (!normalizedDetails.name) {
      throw new Error("顧客名を入力してください。");
    }
    if (!normalizedDetails.company) {
      throw new Error("会社名を入力してください。");
    }
    if (!/^\S+@\S+\.\S+$/.test(normalizedDetails.email)) {
      throw new Error("正しいメールアドレスを入力してください。");
    }

    return this.repository.update(id, normalizedDetails);
  }

  deleteCustomer(id: string): void {
    this.repository.delete(id);
  }

  addNote(customerId: string, body: string, author: string): Customer {
    const normalizedBody = body.trim();
    if (!normalizedBody) {
      throw new Error("メモを入力してください。");
    }

    const noteSequence =
      this.repository.findById(customerId)?.notes.length ?? 0;
    return this.repository.addNote(customerId, {
      id: `note-${customerId}-${this.clock.today()}-${noteSequence + 1}`,
      body: normalizedBody,
      author,
      createdAt: this.clock.today(),
    });
  }
}
