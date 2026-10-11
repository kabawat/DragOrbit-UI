export function resolveLedgerExportPeriod(
  period,
  customStartDate = "",
  customEndDate = "",
) {
  const now = new Date();
  const endOfToday = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999),
  );

  if (period === "today") {
    const startOfToday = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
    );
    return {
      startDate: startOfToday.toISOString(),
      endDate: endOfToday.toISOString(),
    };
  }

  if (period === "thisMonth") {
    const startOfMonth = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
    );
    return {
      startDate: startOfMonth.toISOString(),
      endDate: endOfToday.toISOString(),
    };
  }

  const start = customStartDate ? new Date(customStartDate) : null;
  const end = customEndDate ? new Date(customEndDate) : null;

  return {
    startDate:
      start && !Number.isNaN(start.getTime())
        ? new Date(
            Date.UTC(
              start.getFullYear(),
              start.getMonth(),
              start.getDate(),
              0,
              0,
              0,
              0,
            ),
          ).toISOString()
        : null,
    endDate:
      end && !Number.isNaN(end.getTime())
        ? new Date(
            Date.UTC(
              end.getFullYear(),
              end.getMonth(),
              end.getDate(),
              23,
              59,
              59,
              999,
            ),
          ).toISOString()
        : endOfToday.toISOString(),
  };
}

export function ledgerExportToCsvRows(exportData, t) {
  const rows = (exportData?.entries ?? []).map((entry) => ({
    [t("khata.colDate")]: entry.date
      ? new Date(entry.date).toLocaleDateString("en-IN")
      : "",
    [t("khata.colDescription")]:
      [entry.reference, entry.notes].filter(Boolean).join(" · ") || entry.type,
    [t("khata.colDebit")]: entry.debit || "",
    [t("khata.colCredit")]: entry.credit || "",
    [t("khata.balance")]: entry.balance ?? "",
  }));

  return [
    {
      [t("khata.colDate")]: t("khata.openingBalance"),
      [t("khata.colDescription")]: exportData?.party?.name ?? "",
      [t("khata.colDebit")]: "",
      [t("khata.colCredit")]: "",
      [t("khata.balance")]: exportData?.openingBalance ?? "",
    },
    ...rows,
    {
      [t("khata.colDate")]: t("khata.closingBalance"),
      [t("khata.colDescription")]: "",
      [t("khata.colDebit")]: "",
      [t("khata.colCredit")]: "",
      [t("khata.balance")]: exportData?.closingBalance ?? "",
    },
  ];
}
