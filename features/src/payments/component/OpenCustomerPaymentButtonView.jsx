"use client";
import { Monitor } from "lucide-react";
import { Button } from "@dragorbit/ui";
export function OpenCustomerPaymentButtonPresentation({ model }) {
  const { variant, size, className, showIcon, openCustomerPaymentScreen, t } =
    model;
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      leftIcon={showIcon ? Monitor : undefined}
      onClick={openCustomerPaymentScreen}
    >
      {t("invoice.customerPayment.openDisplay")}
    </Button>
  );
}
