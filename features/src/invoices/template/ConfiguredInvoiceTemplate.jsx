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
  const previewFallback = preview ? {
    storeName: "DragBizz Store",
    address: "12 Market Road, Jaipur, Rajasthan",
    email: "hello@dragbizz.com",
    phone: "+91 98765 43210",
    gstin: "08ABCDE1234F1Z5",
  } : {};
  const fallbackLogo = preview
    ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'%3E%3Crect width='120' height='80' rx='12' fill='%232563eb'/%3E%3Cpath d='M25 58V22h12l23 22V22h12v36H60L37 36v22z' fill='white'/%3E%3Ctext x='80' y='49' font-size='12' font-family='Arial' font-weight='700' fill='white'%3EDB%3C/text%3E%3C/svg%3E"
    : "";
  const store = {
    ...selectedStore,
    storeName: companyName || selectedStore?.storeName || selectedStore?.name || companyDetails?.companyName || previewFallback.storeName,
    address: settings.showAddress ? settings.addressOverride || selectedStore?.address || selectedStore?.storeAddress || selectedStore?.companyAddress || companyDetails?.address || previewFallback.address : "",
    email: settings.showEmail ? settings.emailOverride || selectedStore?.email || selectedStore?.storeEmail || selectedStore?.companyEmail || companyDetails?.email || previewFallback.email : "",
    storeEmail: settings.showEmail ? settings.emailOverride || selectedStore?.storeEmail || selectedStore?.email || companyDetails?.email || previewFallback.email : "",
    phone: settings.showPhone ? settings.phoneOverride || selectedStore?.phone || selectedStore?.mobile || selectedStore?.storePhone || companyDetails?.phone || previewFallback.phone : "",
    gst: settings.showGstin ? settings.gstinOverride || selectedStore?.gst || selectedStore?.gstin || selectedStore?.gstNumber || companyDetails?.gstin || previewFallback.gstin : "",
    gstin: settings.showGstin ? settings.gstinOverride || selectedStore?.gstin || selectedStore?.gst || selectedStore?.gstNumber || companyDetails?.gstin || previewFallback.gstin : "",
    gstNumber: settings.showGstin ? settings.gstinOverride || selectedStore?.gstNumber || selectedStore?.gstin || selectedStore?.gst || companyDetails?.gstin || previewFallback.gstin : "",
    logo: settings.showLogo ? selectedStore?.logo || selectedStore?.logoUrl || companyDetails?.logo || fallbackLogo : "",
    logoUrl: settings.showLogo ? selectedStore?.logoUrl || selectedStore?.logo || companyDetails?.logo || fallbackLogo : "",
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
