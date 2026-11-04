"use client";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
export function PosScreen({
  productPanel,
  cartPanel,
  paymentModal,
  children,
  mobileCartOpen,
  setMobileCartOpen,
  cartSummary,
  hasItems,
  className = "h-full min-h-0",
  formatTotal = (n) =>
    "₹" +
    Number(n || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
}) {
  useEffect(() => {
    if (!mobileCartOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileCartOpen]);
  return (
    <div className={"flex flex-col overflow-hidden " + className}>
      <div className="relative flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
        {mobileCartOpen && (
          <button
            type="button"
            aria-label="Close cart"
            className="lg:hidden absolute inset-0 z-40 bg-[rgb(var(--color-bg-primary))]/55"
            onClick={() => setMobileCartOpen(false)}
          />
        )}
        <div
          className={
            "flex-1 min-h-0 min-w-0 flex flex-col " +
            (mobileCartOpen ? "pointer-events-none lg:pointer-events-auto" : "")
          }
        >
          <div className="flex-1 min-h-0 overflow-hidden">{productPanel}</div>
          {hasItems && !mobileCartOpen && (
            <div className="lg:hidden flex-shrink-0 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-[rgb(var(--color-bg-primary))] border-t border-[rgb(var(--color-border-primary))]">
              <button
                type="button"
                onClick={() => setMobileCartOpen(true)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[rgb(var(--color-primary))] text-white font-semibold text-sm"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">
                    View Cart ({cartSummary.itemCount})
                  </span>
                </span>
                <span className="font-bold tabular-nums flex-shrink-0">
                  {formatTotal(cartSummary.grandTotal)}
                </span>
              </button>
            </div>
          )}
        </div>
        {cartPanel}
      </div>
      {paymentModal}
      {children}
    </div>
  );
}
export default PosScreen;
