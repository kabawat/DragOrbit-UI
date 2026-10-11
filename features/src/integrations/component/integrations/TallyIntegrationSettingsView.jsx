"use client";
import {
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  FileCog,
  Plus,
  ReceiptIndianRupee,
  Save,
  Trash2,
} from "lucide-react";
import { Button, Card, EmptyState, Input, Modal, Toggle } from "@dragorbit/ui";
export function TallyIntegrationSettingsView({ model }) {
  const {
    t,
    form,
    setForm,
    selectedStore,
    setShowAdvanced,
    showAdvanced,
    LEDGER_FIELD_KEYS,
    DEFAULT_PAYMENT_METHOD_LEDGERS,
    setIsExpenseModalOpen,
    expenseMappings,
    removeExpenseCategory,
    isExpenseModalOpen,
    closeExpenseModal,
    newCategory,
    setNewCategory,
    addExpenseCategory,
    handleSave,
    saving,
  } = model;
  return (
    <div className="w-full space-y-4 pb-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          padding="md"
          className="h-full border-[rgb(var(--color-border-primary))]/60"
        >
          <Toggle
            label={t("integrations.enableTally")}
            helperText={t("integrations.enableTallyHint")}
            checked={form.enabled}
            onChange={(enabled) => setForm((prev) => ({ ...prev, enabled }))}
            className="w-full"
          />
        </Card>

        <Card
          padding="md"
          className="h-full border-[rgb(var(--color-border-primary))]/60"
        >
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-lg bg-[rgb(var(--color-primary))]/10 p-2 text-[rgb(var(--color-primary))]">
              <FileCog className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold leading-5 text-[rgb(var(--color-text-primary))]">
                {t("integrations.companyName")}
              </h3>
              <p className="mt-1 text-sm leading-5 text-[rgb(var(--color-text-secondary))]">
                {t("integrations.companyNamePlaceholder")}
              </p>
            </div>
          </div>
          <Input
            label={t("integrations.companyName")}
            value={form.companyName}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, companyName: value }))
            }
            placeholder={
              selectedStore?.name || t("integrations.companyNamePlaceholder")
            }
          />
        </Card>
      </div>

      <Card
        padding="none"
        className="overflow-hidden border-[rgb(var(--color-border-primary))]/60"
      >
        <button
          type="button"
          onClick={() => setShowAdvanced((value) => !value)}
          aria-expanded={showAdvanced}
          className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-[rgb(var(--color-bg-secondary))]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgb(var(--color-primary))]/40 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-[rgb(var(--color-primary))]/10 p-2 text-[rgb(var(--color-primary))]">
              <ReceiptIndianRupee className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold leading-5 text-[rgb(var(--color-text-primary))]">
                {t("integrations.ledgerMapping")}
              </h3>
              <p className="mt-1 text-sm leading-5 text-[rgb(var(--color-text-secondary))]">
                {t("integrations.importGuideHint")}
              </p>
            </div>
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/50">
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
            )}
          </span>
        </button>

        {showAdvanced && (
          <div className="divide-y divide-[rgb(var(--color-border-primary))]/60 border-t border-[rgb(var(--color-border-primary))]/60">
            <section className="p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {LEDGER_FIELD_KEYS.map((key) => (
                  <Input
                    key={key}
                    size="md"
                    label={t(`integrations.ledger.${key}`, key)}
                    value={form.defaultLedgers[key] || ""}
                    onChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        defaultLedgers: {
                          ...prev.defaultLedgers,
                          [key]: value,
                        },
                      }))
                    }
                  />
                ))}
              </div>
            </section>

            <div className="grid divide-y divide-[rgb(var(--color-border-primary))]/60 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              <section className="p-4 sm:p-5">
                <div className="mb-5 flex items-start gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]">
                    <CircleDollarSign className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-base font-semibold leading-5 text-[rgb(var(--color-text-primary))]">
                      {t("integrations.paymentMethodLedgers")}
                    </h4>
                    <p className="mt-1 text-sm leading-5 text-[rgb(var(--color-text-secondary))]">
                      {t("integrations.paymentMethodLedgersDesc")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  {Object.keys(DEFAULT_PAYMENT_METHOD_LEDGERS).map((method) => (
                    <Input
                      key={method}
                      size="md"
                      label={method.replaceAll("_", " ")}
                      value={form.paymentMethodLedgers[method] || ""}
                      onChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          paymentMethodLedgers: {
                            ...prev.paymentMethodLedgers,
                            [method]: value,
                          },
                        }))
                      }
                    />
                  ))}
                </div>
              </section>

              <section className="p-4 sm:p-5">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]">
                      <ReceiptIndianRupee className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-base font-semibold leading-5 text-[rgb(var(--color-text-primary))]">
                        {t("integrations.expenseCategoryLedgers")}
                      </h4>
                      <p className="mt-1 text-sm leading-5 text-[rgb(var(--color-text-secondary))]">
                        {t("integrations.expenseCategoryLedgersDesc")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={Plus}
                    onClick={() => setIsExpenseModalOpen(true)}
                  >
                    {t("common.add")}
                  </Button>
                </div>

                {expenseMappings.length > 0 ? (
                  <div className="grid gap-2 xl:grid-cols-2">
                    {expenseMappings.map(([name, ledger]) => (
                      <div
                        key={name}
                        className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-secondary))]/40 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[rgb(var(--color-text-primary))]">
                            {name}
                          </p>
                          <p className="truncate text-xs text-[rgb(var(--color-text-secondary))]">
                            {ledger}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => removeExpenseCategory(name)}
                          aria-label={`${t("common.remove")} ${name}`}
                        >
                          <Trash2 className="h-4 w-4 text-[rgb(var(--color-danger))]" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    size="sm"
                    icon={ReceiptIndianRupee}
                    title={t("integrations.expenseCategoryEmpty")}
                    description={t("integrations.expenseCategoryLedgersDesc")}
                    className="!py-5 [&_h2]:!mb-1 [&_h2]:!text-sm [&_h2]:!font-semibold [&_p]:!mb-4 [&_p]:!text-xs [&_p]:!leading-5"
                    actionButton={{
                      label: t("common.add"),
                      icon: Plus,
                      onClick: () => setIsExpenseModalOpen(true),
                    }}
                  />
                )}
              </section>
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isExpenseModalOpen}
        onClose={closeExpenseModal}
        title={t("integrations.addExpenseCategory")}
        size="md"
        className="!shadow-none"
      >
        <div className="space-y-4">
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">
            {t("integrations.expenseCategoryLedgersDesc")}
          </p>
          <Input
            size="md"
            label={t("integrations.categoryName")}
            value={newCategory.name}
            onChange={(value) =>
              setNewCategory((prev) => ({
                ...prev,
                name: value,
              }))
            }
          />
          <Input
            size="md"
            label={t("integrations.ledgerName")}
            value={newCategory.ledger}
            onChange={(value) =>
              setNewCategory((prev) => ({
                ...prev,
                ledger: value,
              }))
            }
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeExpenseModal}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="primary"
              leftIcon={Plus}
              onClick={addExpenseCategory}
              disabled={!newCategory.name.trim() || !newCategory.ledger.trim()}
            >
              {t("common.add")}
            </Button>
          </div>
        </div>
      </Modal>

      <div className="sticky bottom-0 flex items-center justify-between gap-4 rounded-xl border border-[rgb(var(--color-border-primary))]/60 bg-[rgb(var(--color-bg-primary))]/95 p-3 backdrop-blur sm:p-4">
        <p className="hidden text-sm leading-5 text-[rgb(var(--color-text-secondary))] sm:block">
          {t("integrations.importGuideHint")}
        </p>
        <Button
          size="md"
          onClick={handleSave}
          isLoading={saving}
          leftIcon={Save}
          className="ml-auto"
        >
          {t("common.save")}
        </Button>
      </div>
    </div>
  );
}
