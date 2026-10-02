import type { Clock } from "@/ports/clock";
import type { Customer, CustomerRepository } from "@/ports/customer-repository";

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
