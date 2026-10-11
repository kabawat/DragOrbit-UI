export function resolveCustomerTotalDue(customer) {
  return Number(
    customer?.account?.totalDue ??
      customer?.accountDetails?.totalDue ??
      customer?.totalDue ??
      0,
  );
}

function roundedPaise(totalDue) {
  return Math.round(totalDue * 100);
}

/** True when customer has either receivable (+) or advance (-) ledger balance. */
export function customerHasLedgerBalance(customer) {
  const totalDue = resolveCustomerTotalDue(customer);
  if (!Number.isFinite(totalDue)) return false;
  return roundedPaise(totalDue) !== 0;
}

export function customerMatchesBalanceFilter(customer, balanceFilter = "") {
  if (!balanceFilter) return true;

  const totalDue = resolveCustomerTotalDue(customer);
  if (!Number.isFinite(totalDue)) return false;

  const paise = roundedPaise(totalDue);
  if (balanceFilter === "both") return paise !== 0;
  if (balanceFilter === "due") return paise > 0;
  if (balanceFilter === "advance") return paise < 0;
  return true;
}

export function filterCustomersByBalance(customers = [], balanceFilter = "") {
  if (!balanceFilter) return customers;
  return customers.filter((customer) =>
    customerMatchesBalanceFilter(customer, balanceFilter),
  );
}

export function filterCustomersWithLedgerBalance(customers = []) {
  return filterCustomersByBalance(customers, "both");
}
