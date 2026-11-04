"use client";
import { Receipt, ArrowRight } from "lucide-react";
import { Button } from "@dragorbit/ui";
export function CartPaymentSectionPresentation({ model }) {
  const { checkoutRef, handleCheckout, invoiceLoading, fmt, grandTotal } =
    model;
  return (
    <div className="p-4 pt-0">
      <div
        ref={(el) => {
          if (checkoutRef)
            checkoutRef.current = el?.querySelector("button") ?? null;
        }}
        className="w-full"
      >
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={handleCheckout}
          disabled={invoiceLoading}
          loading={invoiceLoading}
          leftIcon={Receipt}
          rightIcon={ArrowRight}
          className="uppercase tracking-wide font-semibold"
        >
          Collect {fmt(grandTotal)}
        </Button>
      </div>
    </div>
  );
}
