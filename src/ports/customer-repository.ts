export type CustomerStatus = "active" | "followUp" | "inactive";
export type CustomerRank = "S" | "A" | "B";

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
  rank: CustomerRank;
  owner: string;
  lastContactedAt: string;
  nextAction: string;
  initials: string;
  accent: string;
  notes: CustomerNote[];
};

export type EditableCustomer = Pick<
  Customer,
  | "name"
  | "nameKana"
  | "company"
  | "department"
  | "title"
  | "email"
  | "phone"
  | "status"
  | "rank"
  | "owner"
  | "lastContactedAt"
  | "nextAction"
>;

export interface CustomerRepository {
  list(): Customer[];
  findById(id: string): Customer | undefined;
  update(id: string, details: EditableCustomer): Customer;
  delete(id: string): void;
  addNote(customerId: string, note: CustomerNote): Customer;
}
