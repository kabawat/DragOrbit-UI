export const formatCurrency = (amount, options = {}) => {
  const {
    currency = "INR",
    locale = "en-IN",
    showSymbol = true,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  if (amount === null || amount === undefined) {
    return showSymbol ? "₹0.00" : "0.00";
  }

  const numAmount = Number(amount);

  if (Number.isNaN(numAmount)) {
    return showSymbol ? "₹0.00" : "0.00";
  }

  if (showSymbol) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(numAmount);
  } else {
    return numAmount.toLocaleString(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
    });
  }
};

export const formatCurrencySimple = (amount) => {
  if (!amount && amount !== 0) return "₹0";
  return `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatCurrencyWithoutSymbol = (amount) => {
  if (amount === null || amount === undefined) return "0.00";
  const numAmount = Number(amount);
  if (Number.isNaN(numAmount)) return "0.00";

  return numAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return (num || 0).toLocaleString("en-IN");
};

export const parseCurrency = (value) => {
  if (!value) return 0;
  const cleaned = String(value).replace(/[₹,\s]/g, "");
  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
};
