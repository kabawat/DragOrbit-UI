"use client";
import { Button, Card, Input, Select, Tooltip as SharedTooltip, Toggle } from "@dragorbit/ui";
import { IndianRupee, Plus, Trash2 } from "lucide-react";
export function CreateAdvancePaymentCardPresentation({ model }) {
  const {
    t,
    showAdvancePayment,
    setShowAdvancePayment,
    paymentMethod,
    handlePaymentMethodChange,
    PAYMENT_METHODS,
    paymentAmount,
    setPaymentAmount,
    paymentReference,
    setPaymentReference,
    paymentDetails,
    updatePaymentDetails,
    addPayment,
    formData,
    removePayment,
  } = model;
  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 border border-[rgb(var(--color-border-primary))] rounded-lg flex items-center justify-center mr-3 bg-[rgb(var(--color-primary))]/10">
              <IndianRupee className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                {t("purchaseOrders.advancePayment")}
              </h3>
              <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                {t("purchaseOrders.optionalAdvancePayments")}
              </p>
            </div>
          </div>

          <Toggle
            checked={showAdvancePayment}
            onChange={setShowAdvancePayment}
            label=""
            size="sm"
          />
        </div>

        {showAdvancePayment && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                    {t("purchaseOrders.paymentMethod")}
                  </label>
                  <Select
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                    options={PAYMENT_METHODS(t)}
                    size="sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                    {t("purchaseOrders.amount")} (₹)
                  </label>
                  <Input
                    type="number"
                    value={paymentAmount}
                    onChange={setPaymentAmount}
                    placeholder={t("products.enterAmount")}
                    leftIcon={IndianRupee}
                    size="sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                  {t("purchaseOrders.reference")}
                </label>
                <Input
                  type="text"
                  value={paymentReference}
                  onChange={setPaymentReference}
                  placeholder={t("purchaseOrders.transactionReference")}
                  size="sm"
                />
              </div>

              {/* Payment Method Specific Details */}
              {paymentMethod === "UPI" && (
                <div className="space-y-3 p-3 rounded-lg bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-border-primary))]">
                  <h5 className="text-xs font-medium text-[rgb(var(--color-primary))]">
                    {t("purchaseOrders.upiDetails")}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                        {t("purchaseOrders.upiId")}
                      </label>
                      <Input
                        type="text"
                        value={paymentDetails.upiId || ""}
                        onChange={(value) =>
                          updatePaymentDetails("upiId", value)
                        }
                        placeholder={t("purchaseOrders.supplierPaytm")}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                        {t("purchaseOrders.transactionId")}
                      </label>
                      <Input
                        type="text"
                        value={paymentDetails.transactionId || ""}
                        onChange={(value) =>
                          updatePaymentDetails("transactionId", value)
                        }
                        placeholder={t(
                          "purchaseOrders.upiTransactionIdPlaceholder",
                        )}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "BANK_TRANSFER" && (
                <div className="space-y-3 p-3 rounded-lg bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-border-primary))]">
                  <h5 className="text-xs font-medium text-[rgb(var(--color-primary))]">
                    {t("purchaseOrders.bankTransferDetails")}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                        {t("purchaseOrders.bankName")}
                      </label>
                      <Input
                        type="text"
                        value={paymentDetails.bankName || ""}
                        onChange={(value) =>
                          updatePaymentDetails("bankName", value)
                        }
                        placeholder={t("purchaseOrders.stateBankOfIndia")}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                        {t("purchaseOrders.ifscCode")}
                      </label>
                      <Input
                        type="text"
                        value={paymentDetails.ifscCode || ""}
                        onChange={(value) =>
                          updatePaymentDetails("ifscCode", value)
                        }
                        placeholder={t("purchaseOrders.ifscCodePlaceholder")}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                        {t("purchaseOrders.accountNumber")}
                      </label>
                      <Input
                        type="text"
                        value={paymentDetails.accountNumber || ""}
                        onChange={(value) =>
                          updatePaymentDetails("accountNumber", value)
                        }
                        placeholder={t(
                          "purchaseOrders.accountNumberPlaceholder",
                        )}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                        {t("purchaseOrders.accountHolderName")}
                      </label>
                      <Input
                        type="text"
                        value={paymentDetails.holderName || ""}
                        onChange={(value) =>
                          updatePaymentDetails("holderName", value)
                        }
                        placeholder={t("purchaseOrders.abcSuppliers")}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "CHEQUE" && (
                <div className="space-y-3 p-3 rounded-lg bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-border-primary))]">
                  <h5 className="text-xs font-medium text-[rgb(var(--color-primary))]">
                    {t("purchaseOrders.chequeDetails")}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                        {t("purchaseOrders.chequeNumber")}
                      </label>
                      <Input
                        type="text"
                        value={paymentDetails.chequeNumber || ""}
                        onChange={(value) =>
                          updatePaymentDetails("chequeNumber", value)
                        }
                        placeholder={t(
                          "purchaseOrders.chequeNumberPlaceholder",
                        )}
                        size="sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                        {t("purchaseOrders.chequeDate")}
                      </label>
                      <Input
                        type="date"
                        value={paymentDetails.chequeDate || ""}
                        onChange={(value) =>
                          updatePaymentDetails("chequeDate", value)
                        }
                        size="sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                        {t("purchaseOrders.bankName")}
                      </label>
                      <Input
                        type="text"
                        value={paymentDetails.bankName || ""}
                        onChange={(value) =>
                          updatePaymentDetails("bankName", value)
                        }
                        placeholder={t("purchaseOrders.hdfcBank")}
                        size="sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[rgb(var(--color-text-primary))] mb-1">
                        {t("purchaseOrders.branchName")}
                      </label>
                      <Input
                        type="text"
                        value={paymentDetails.branchName || ""}
                        onChange={(value) =>
                          updatePaymentDetails("branchName", value)
                        }
                        placeholder={t("purchaseOrders.mainBranch")}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={addPayment}
                  disabled={!paymentAmount || !paymentReference}
                  leftIcon={Plus}
                >
                  {t("purchaseOrders.addPayment")}
                </Button>
              </div>
            </div>

            {/* Added Payments List */}
            {formData.payment.length > 0 && (
              <div className="border border-[rgb(var(--color-border-primary))] rounded-lg bg-[rgb(var(--color-bg-secondary))]/30">
                <div className="px-3 py-2 border-b border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-tertiary))]/50">
                  <h4 className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">
                    {t("purchaseOrders.addedPayments")} (
                    {formData.payment.length})
                  </h4>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  <div className="divide-y divide-[rgb(var(--color-border-primary))]">
                    {formData.payment.map((payment, index) => (
                      <div
                        key={index}
                        className="px-3 py-3 hover:bg-[rgb(var(--color-bg-secondary))]/30 transition-colors duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-[rgb(var(--color-text-primary))]">
                                {payment.method}
                              </span>
                              <span className="text-xs text-[rgb(var(--color-text-secondary))] bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                ₹{payment.amount}
                              </span>
                            </div>
                            <span className="text-xs text-[rgb(var(--color-text-secondary))] truncate block">
                              {payment.reference}
                            </span>
                          </div>
                          <SharedTooltip content={t("purchaseOrders.removePayment")}><button aria-label={t("purchaseOrders.removePayment")}
                            type="button"
                            onClick={() => removePayment(index)}
                            className="flex-shrink-0 p-1.5 cursor-pointer text-[rgb(var(--color-danger))] hover:text-[rgb(var(--color-danger))] hover:bg-[rgba(var(--color-danger),0.1)] rounded-md transition-colors duration-200 opacity-0 group-hover:opacity-100"

                          >
                            <Trash2 className="w-3 h-3" />
                          </button></SharedTooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
