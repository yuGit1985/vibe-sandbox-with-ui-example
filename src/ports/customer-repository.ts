export type CustomerStatus = "active" | "followUp" | "inactive";

export type CustomerNote = {
  id: string;
  body: string;
  createdAt: string;
  author: string;
};

export type Customer = {
  id: string;
  name: string;
  nameKana: string;
  company: string;
  department: string;
  title: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  owner: string;
  lastContactedAt: string;
  nextAction: string;
  initials: string;
  accent: string;
  notes: CustomerNote[];
};

export interface CustomerRepository {
  list(): Customer[];
  findById(id: string): Customer | undefined;
  addNote(customerId: string, note: CustomerNote): Customer;
}
