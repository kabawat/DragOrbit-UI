import en from "./en.json";
import hi from "./hi.json";
import hiEn from "./hi-en.json";
import gu from "./gu.json";

export const invoiceTranslations = {
  en,
  hi,
  "hi-en": hiEn,
  gu,
};

export function getInvoiceMessages(locale = "en") {
  return invoiceTranslations[locale] || invoiceTranslations.en;
}

export { en, hi, hiEn, gu };
export default invoiceTranslations;
