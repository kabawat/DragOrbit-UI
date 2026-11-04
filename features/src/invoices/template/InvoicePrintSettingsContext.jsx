import { createContext, useContext } from "react";
import { DEFAULT_PRINT_SETTINGS } from "./printSettings.js";

export const InvoicePrintSettingsContext = createContext(null);

export function useInvoicePrintContext() {
  return useContext(InvoicePrintSettingsContext);
}

export function getDefaultPrintSettings(group) {
  return DEFAULT_PRINT_SETTINGS[group] || DEFAULT_PRINT_SETTINGS.regular;
}
