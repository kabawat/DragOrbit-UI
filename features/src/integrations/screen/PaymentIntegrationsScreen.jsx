"use client";
export function PaymentIntegrationsScreen({ model }) {
  const { ManagePaymentSettings } = model;
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden p-4 sm:p-6">
      <div className="w-full h-full overflow-y-auto custom-scrollbar">
        <ManagePaymentSettings />
      </div>
    </div>
  );
}
