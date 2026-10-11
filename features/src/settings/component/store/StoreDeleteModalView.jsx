"use client";
import { AlertCircle, Mail, Phone } from "lucide-react";
import { Button, Modal } from "@dragorbit/ui";
export function StoreDeleteModalView({ model }) {
  const {
    isOpen,
    handleCancel,
    step,
    storeToDelete,
    userProfile,
    isLoading,
    setChannel,
    channel,
    formatPhoneNumber,
    formatEmail,
    error,
    handleRequestOtp,
    otp,
    inputRefs,
    handleOtpChange,
    handleOtpKeyDown,
    timeLeft,
    formatTime,
    handleVerifyOtp,
  } = model;
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={step === 1 ? "Delete Store" : "Verify OTP"}
      size={step === 1 ? "3xl" : "lg"}
    >
      <div className="space-y-4">
        {step === 1 ? (
          <>
            <p className="text-[rgb(var(--color-text-secondary))]">
              To delete this store, we need to verify your identity. Please
              select how you want to receive the OTP.
            </p>
            <div className="rounded-lg border border-red-500/40 bg-gradient-to-r from-red-500/10 to-orange-500/5 px-4 py-3 text-sm text-[rgb(var(--color-text-primary))]">
              <p className="font-semibold text-red-500 mb-2 flex items-center gap-2">
                <span className="text-lg">💥</span>
                <span>Permanent Deletion Warning</span>
              </p>
              <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">
                Deleting this store will{" "}
                <span className="font-semibold text-red-400">
                  permanently remove all associated data
                </span>{" "}
                including invoices, bills, products, inventory, transactions,
                suppliers, customers, payments, and purchase orders.{" "}
                <span className="font-semibold text-orange-400">
                  This action cannot be undone
                </span>{" "}
                - once deleted, the data cannot be recovered or restored. Please
                confirm you want to proceed.
              </p>
            </div>
            {storeToDelete && (
              <div className="bg-[rgb(var(--color-bg-secondary))] p-4 rounded-lg border border-[rgb(var(--color-border-primary))]">
                <p className="font-medium text-[rgb(var(--color-text-primary))]">
                  Store: {storeToDelete.name}
                </p>
                {storeToDelete.address && (
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
                    {[
                      storeToDelete.address.line1,
                      storeToDelete.address.city,
                      storeToDelete.address.state,
                      storeToDelete.address.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-4 pt-6">
              <label className="block text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-3">
                Choose how to receive OTP
              </label>
              {!userProfile?.phone && !userProfile?.email ? (
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-sm text-yellow-600">
                    No contact information available. Please update your profile
                    with phone or email.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userProfile?.phone && (
                    <div
                      onClick={() => !isLoading && setChannel("sms")}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        channel === "sms"
                          ? "bg-[rgb(var(--color-primary))]/10"
                          : "bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))]"
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          channel === "sms"
                            ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]"
                            : "border-[rgb(var(--color-border-primary))]"
                        }`}
                      >
                        {channel === "sms" && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <Phone
                        className={`w-5 h-5 flex-shrink-0 ${
                          channel === "sms"
                            ? "text-[rgb(var(--color-primary))]"
                            : "text-[rgb(var(--color-text-secondary))]"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            channel === "sms"
                              ? "text-[rgb(var(--color-primary))]"
                              : "text-[rgb(var(--color-text-primary))]"
                          }`}
                        >
                          SMS
                        </p>
                        <p
                          className={`text-xs ${
                            channel === "sms"
                              ? "text-[rgb(var(--color-primary))]"
                              : "text-[rgb(var(--color-text-secondary))]"
                          }`}
                        >
                          {formatPhoneNumber(
                            userProfile?.phone,
                            userProfile?.countryCode,
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {userProfile?.email && (
                    <div
                      onClick={() => !isLoading && setChannel("email")}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        channel === "email"
                          ? "bg-[rgb(var(--color-primary))]/10"
                          : "bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-bg-tertiary))]"
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          channel === "email"
                            ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]"
                            : "border-[rgb(var(--color-border-primary))]"
                        }`}
                      >
                        {channel === "email" && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <Mail
                        className={`w-5 h-5 flex-shrink-0 ${
                          channel === "email"
                            ? "text-[rgb(var(--color-primary))]"
                            : "text-[rgb(var(--color-text-secondary))]"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            channel === "email"
                              ? "text-[rgb(var(--color-primary))]"
                              : "text-[rgb(var(--color-text-primary))]"
                          }`}
                        >
                          Email
                        </p>
                        <p
                          className={`text-xs ${
                            channel === "email"
                              ? "text-[rgb(var(--color-primary))]"
                              : "text-[rgb(var(--color-text-secondary))]"
                          }`}
                        >
                          {formatEmail(userProfile?.email)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleRequestOtp}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[rgb(var(--color-primary))]/10 mb-3">
                {channel === "sms" ? (
                  <Phone className="w-6 h-6 text-[rgb(var(--color-primary))]" />
                ) : (
                  <Mail className="w-6 h-6 text-[rgb(var(--color-primary))]" />
                )}
              </div>
              <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-1">
                Enter Verification Code
              </h3>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                We've sent a 6-digit OTP to your{" "}
                {channel === "sms" ? "phone" : "email"}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        if (el) inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      disabled={isLoading}
                      className={`w-11 h-11 text-center text-lg font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-[rgb(var(--color-primary))] transition-all ${
                        error
                          ? "border-red-500 bg-red-50 text-red-600"
                          : digit
                            ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5 text-[rgb(var(--color-primary))]"
                            : "border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))]"
                      }`}
                    />
                  ))}
                </div>
                {error && (
                  <div className="flex items-center justify-center gap-2 mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {timeLeft > 0 && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgb(var(--color-bg-secondary))] rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-primary))] animate-pulse"></div>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                      Expires in{" "}
                      <span className="font-semibold text-[rgb(var(--color-primary))]">
                        {formatTime(timeLeft)}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[rgb(var(--color-border-primary))]">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleVerifyOtp(otp.join(""))}
                disabled={isLoading || otp.some((d) => !d)}
                className="flex items-center gap-2 min-w-[140px]"
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {isLoading ? "Verifying..." : "Verify & Delete"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
