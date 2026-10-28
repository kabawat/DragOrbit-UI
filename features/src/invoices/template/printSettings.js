export const PRINT_SETTINGS_STORAGE_KEY = "invoice-print-settings-v1";

export const PRINT_SETTING_OPTIONS = [
  ["showHeader", "Invoice header"],
  ["showLogo", "Company logo"],
  ["showCompanyName", "Company name"],
  ["showAddress", "Address"],
  ["showEmail", "Email"],
  ["showPhone", "Phone number"],
  ["showGstin", "GSTIN"],
  ["showTotalValues", "Total Values"],
  ["showAmountDecimals", "Amount with decimals"],
  ["showReceivedAmount", "Received amount"],
  ["showBalanceAmount", "Balance amount"],
  ["showCustomerBalance", "Customer current balance"],
  ["showTaxDetails", "Tax details (CGST / SGST)"],
  ["showAmountInWords", "Amount in words"],
  ["showDescription", "Item description"],
  ["showTerms", "Terms and conditions"],
  ["showSignature", "Signature"],
  ["showPaymentMode", "Payment mode"],
  ["showAcknowledgement", "Print acknowledgement"],
];

export const DEFAULT_PRINT_SETTINGS = {
  regular: {
    primaryColor: "#2563eb",
    paperSize: "A4",
    textSize: "medium",
    companyNameSize: "medium",
    companyName: "",
    acknowledgementText: "Goods received in good condition.",
    showHeader: true,
    showLogo: true,
    showCompanyName: true,
    showAddress: true,
    showEmail: true,
    showPhone: true,
    showGstin: true,
    showTotalValues: true,
    showAmountDecimals: true,
    showReceivedAmount: false,
    showBalanceAmount: false,
    showCustomerBalance: false,
    showTaxDetails: false,
    showAmountInWords: false,
    showDescription: true,
    showTerms: false,
    showSignature: false,
    showPaymentMode: false,
    showAcknowledgement: false,
  },
  thermal: {
    paperSize: "80mm",
    textSize: "medium",
    companyNameSize: "medium",
    companyName: "",
    acknowledgementText: "Goods received in good condition.",
    showHeader: true,
    showLogo: true,
    showCompanyName: true,
    showAddress: true,
    showEmail: true,
    showPhone: true,
    showGstin: true,
    showTotalValues: true,
    showAmountDecimals: true,
    showReceivedAmount: false,
    showBalanceAmount: false,
    showCustomerBalance: false,
    showTaxDetails: false,
    showAmountInWords: false,
    showDescription: true,
    showTerms: false,
    showSignature: false,
    showPaymentMode: false,
    showAcknowledgement: false,
  },
};

export function readPrintSettings() {
  if (typeof window === "undefined") return DEFAULT_PRINT_SETTINGS;
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(PRINT_SETTINGS_STORAGE_KEY) || "{}",
    );
    const mergeSettings = (group) => {
      const saved = { ...(stored[group] || {}) };
      if (saved.showTotalValues === undefined && saved.showTotalQuantity !== undefined) {
        saved.showTotalValues = saved.showTotalQuantity;
      }
      delete saved.showTotalQuantity;
      delete saved.showReceivedDetails;
      return { ...DEFAULT_PRINT_SETTINGS[group], ...saved };
    };
    return { regular: mergeSettings("regular"), thermal: mergeSettings("thermal") };
  } catch {
    return DEFAULT_PRINT_SETTINGS;
  }
}

export function writePrintSettings(settings) {
  try {
    window.localStorage.setItem(PRINT_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Keep settings usable for this session when storage is unavailable.
  }
}

export const getPrinterGroup = (templateKey) =>
  templateKey?.startsWith("thermal-") ? "thermal" : "regular";
