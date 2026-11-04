"use client";
export function ManagePaymentSettingsView({ model }) {
  const {
    PAYMENT_SUB_TABS,
    activeSubTab,
    t,
    handleSubTabChange,
    ManageUpiSettings,
    ManagePaymentGatewaySettings,
  } = model;
  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-[rgb(var(--color-border-primary))]/50 pb-1">
        {PAYMENT_SUB_TABS.map(({ id, icon: Icon }) => {
          const isActive = activeSubTab === id;
          const label =
            id === "upi"
              ? t("settings.paymentSubTabs.subTabUpi")
              : t("settings.paymentSubTabs.subTabGateway");
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleSubTabChange(id)}
              className={`flex cursor-pointer items-center gap-2 rounded-t-lg px-3 py-2 text-sm font-medium leading-5 transition-colors ${
                isActive
                  ? "text-[rgb(var(--color-primary))] border-b-2 border-[rgb(var(--color-primary))] -mb-[1px]"
                  : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {activeSubTab === "upi" ? (
        <ManageUpiSettings />
      ) : (
        <ManagePaymentGatewaySettings />
      )}
    </div>
  );
}
