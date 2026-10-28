"use client";

import { useEffect, useState } from "react";
import { getTemplateComponent } from "./registry.js";
import { InvoicePrintSettingsContext, getDefaultPrintSettings } from "./InvoicePrintSettingsContext.jsx";
import { getPrinterGroup, readPrintSettings } from "./printSettings.js";

export function ConfiguredInvoiceTemplate({
  templateKey,
  invoiceData,
  selectedStore,
  signatures = [],
  settings: providedSettings,
  signatureSettingsUrl,
  fitPreview = false,
  preview = false,
}) {
  const group = getPrinterGroup(templateKey);
  const [storedSettings, setStoredSettings] = useState(() => getDefaultPrintSettings(group));

  useEffect(() => {
    setStoredSettings(readPrintSettings()[group]);
  }, [group]);

  const settings = providedSettings || storedSettings;
  const companyName = String(settings.companyName || "").trim();
  const companyDetails = selectedStore?.companyDetails || {};
  const store = {
    ...selectedStore,
    storeName: companyName || selectedStore?.storeName || selectedStore?.name || companyDetails?.companyName,
    address: settings.showAddress ? settings.addressOverride || selectedStore?.address || selectedStore?.storeAddress || selectedStore?.companyAddress || companyDetails?.address : "",
    email: settings.showEmail ? settings.emailOverride || selectedStore?.email || selectedStore?.storeEmail || selectedStore?.companyEmail || companyDetails?.email : "",
    storeEmail: settings.showEmail ? settings.emailOverride || selectedStore?.storeEmail || selectedStore?.email || companyDetails?.email : "",
    phone: settings.showPhone ? settings.phoneOverride || selectedStore?.phone || selectedStore?.mobile || selectedStore?.storePhone || companyDetails?.phone : "",
    gst: settings.showGstin ? settings.gstinOverride || selectedStore?.gst || selectedStore?.gstin || selectedStore?.gstNumber || companyDetails?.gstin : "",
    gstin: settings.showGstin ? settings.gstinOverride || selectedStore?.gstin || selectedStore?.gst || selectedStore?.gstNumber || companyDetails?.gstin : "",
    gstNumber: settings.showGstin ? settings.gstinOverride || selectedStore?.gstNumber || selectedStore?.gstin || selectedStore?.gst || companyDetails?.gstin : "",
    logo: settings.showLogo ? selectedStore?.logo || selectedStore?.logoUrl || companyDetails?.logo : "",
    logoUrl: settings.showLogo ? selectedStore?.logoUrl || selectedStore?.logo || companyDetails?.logo : "",
  };
  if (!settings.showCompanyName) store.storeName = " ";

  const configuredInvoice = {
    ...invoiceData,
    invoiceNumber: invoiceData?.invoiceNumber || invoiceData?.number || invoiceData?.invoiceNo,
    createdAt: invoiceData?.createdAt || invoiceData?.invoiceDate || invoiceData?.date,
    customer: typeof invoiceData?.customer === "object" && invoiceData.customer !== null
      ? {
          ...invoiceData.customer,
          name: invoiceData.customer.name || invoiceData.customer.customerName || invoiceData.customerName,
          email: invoiceData.customer.email || invoiceData.customer.customerEmail,
          phone: invoiceData.customer.phone || invoiceData.customer.mobile || invoiceData.customer.customerPhone,
          currentBalance: invoiceData.customer.currentBalance ?? invoiceData.customer.balance ?? invoiceData.customerBalance,
        }
      : invoiceData?.customerName
        ? { name: invoiceData.customerName, email: invoiceData.customerEmail, phone: invoiceData.customerPhone, currentBalance: invoiceData.customerBalance }
        : invoiceData?.customer,
    items: (invoiceData?.items || []).map((item) => ({
      ...item,
      description: settings.showDescription ? item.description : "",
      product: item.product
        ? { ...item.product, description: settings.showDescription ? item.product.description : "" }
        : item.product,
      gst: settings.showTaxDetails ? item.gst : undefined,
    })),
    gst: settings.showTaxDetails ? invoiceData?.gst : undefined,
    gstAmount: settings.showTaxDetails ? invoiceData?.gstAmount : 0,
    amountPaid: settings.showReceivedAmount ? invoiceData?.amountPaid : undefined,
    receivedAmount: settings.showReceivedAmount ? invoiceData?.receivedAmount : undefined,
    balanceDue: settings.showBalanceAmount ? invoiceData?.balanceDue : undefined,
    paymentMode: settings.showPaymentMode ? invoiceData?.paymentMode : undefined,
    notes: settings.showTerms ? invoiceData?.notes : undefined,
    termsAndConditions: settings.showTerms ? invoiceData?.termsAndConditions : undefined,
  };
  const requestedSignatureId = invoiceData?.signatureId || invoiceData?.signature?._id || invoiceData?.signature?.id;
  const defaultSignature = [...signatures]
    .filter((item) => item?.content)
    .sort((first, second) => new Date(second.createdAt || 0) - new Date(first.createdAt || 0))[0];
  const signature =
    (invoiceData?.signature?.content && invoiceData.signature) ||
    (selectedStore?.signature?.content && selectedStore.signature) ||
    signatures.find((item) => String(item.id || item._id) === String(requestedSignatureId)) ||
    defaultSignature ||
    null;
  const Template = getTemplateComponent(templateKey);

  return (
    <InvoicePrintSettingsContext.Provider
      value={{ settings, invoiceData: configuredInvoice, selectedStore: store, group, signature, signatureSettingsUrl, fitPreview, preview }}
    >
      <Template invoiceData={configuredInvoice} selectedStore={store} />
    </InvoicePrintSettingsContext.Provider>
  );
}
