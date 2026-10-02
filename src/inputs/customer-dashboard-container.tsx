"use client";

import { useState } from "react";
import { FixedClock } from "@/fakes/fixed-clock";
import { InMemoryCustomerRepository } from "@/fakes/in-memory-customer-repository";
import type { Customer } from "@/ports/customer-repository";
import type { User } from "@/ports/user-repository";
import { CustomerDashboard } from "@/ui/screens/customer-dashboard";
import { CustomerManagement } from "@/usecases/customer-management";

type Props = {
  user: User;
  logoutAction: () => Promise<void>;
};

export function CustomerDashboardContainer({ user, logoutAction }: Props) {
  const [management] = useState(
    () =>
      new CustomerManagement(
        new InMemoryCustomerRepository(),
        new FixedClock(),
      ),
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
      logoutAction={logoutAction}
    />
  );
}
