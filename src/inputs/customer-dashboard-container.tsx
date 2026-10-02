"use client";

import { useState } from "react";
import { FixedClock } from "@/fakes/fixed-clock";
import { InMemoryCustomerRepository } from "@/fakes/in-memory-customer-repository";
import { InMemoryEmailSender } from "@/fakes/in-memory-email-sender";
import type { Customer, EditableCustomer } from "@/ports/customer-repository";
import type { User } from "@/ports/user-repository";
import { CustomerDashboard } from "@/ui/screens/customer-dashboard";
import { CustomerEmail } from "@/usecases/customer-email";
import { CustomerManagement } from "@/usecases/customer-management";

type Props = {
  user: User;
  logoutAction: () => Promise<void>;
};

export function CustomerDashboardContainer({ user, logoutAction }: Props) {
  const [customerRepository] = useState(() => new InMemoryCustomerRepository());
  const [management] = useState(
    () => new CustomerManagement(customerRepository, new FixedClock()),
  );
  const [customerEmail] = useState(
    () => new CustomerEmail(customerRepository, new InMemoryEmailSender()),
  );
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(() =>
    management.listCustomers(),
  );
  const [selectedId, setSelectedId] = useState(customers[0]?.id ?? "");
  const selectedCustomer = management.getCustomer(selectedId);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    const results = management.listCustomers(value);
    setCustomers(results);
    if (results.length > 0 && !results.some(({ id }) => id === selectedId))
      setSelectedId(results[0]?.id ?? "");
  };

  const handleAddNote = (body: string) => {
    management.addNote(selectedId, body, "田中");
    setCustomers(management.listCustomers(query));
  };

  const handleSendEmail = (subject: string, body: string) => {
    customerEmail.send(selectedId, subject, body);
  };

  const handleUpdateCustomer = (details: EditableCustomer) => {
    management.updateCustomer(selectedId, details);
    const results = management.listCustomers(query);
    setCustomers(results);
    if (!results.some(({ id }) => id === selectedId)) {
      setSelectedId(results[0]?.id ?? "");
    }
  };

  const handleDeleteCustomer = () => {
    management.deleteCustomer(selectedId);
    const remainingCustomers = management.listCustomers(query);
    setCustomers(remainingCustomers);
    setSelectedId(remainingCustomers[0]?.id ?? "");
  };

  return (
    <CustomerDashboard
      user={user}
      customers={customers}
      selectedCustomer={selectedCustomer}
      query={query}
      totalCount={management.listCustomers().length}
      onQueryChange={handleQueryChange}
      onSelectCustomer={setSelectedId}
      onAddNote={handleAddNote}
      onSendEmail={handleSendEmail}
      onUpdateCustomer={handleUpdateCustomer}
      onDeleteCustomer={handleDeleteCustomer}
      logoutAction={logoutAction}
    />
  );
}
