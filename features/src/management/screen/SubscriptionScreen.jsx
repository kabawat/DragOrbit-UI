"use client";
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Info,
  Loader2,
} from "lucide-react";
import { Card, CardBody, Badge, Button } from "@dragorbit/ui";
export function SubscriptionScreen({ model }) {
  const {
    isLoading,
    subscription,
    onUpgrade,
    t,
    planName,
    isKhataFree,
    moment,
    ManagementShortcuts,
  } = model;
  return (
    <div className="flex-1 p-5">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-[rgb(var(--color-bg-primary))] border-[rgb(var(--color-border-primary))] overflow-hidden relative">
              {isLoading ? (
                <div className="flex items-center justify-center p-16">
                  <Loader2
                    size={32}
                    className="animate-spin text-[rgb(var(--color-primary))]"
                  />
                </div>
              ) : !subscription ? (
                <CardBody className="p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-[rgb(var(--color-primary))]/10 rounded-full flex items-center justify-center mb-6">
                    <Zap className="w-12 h-12 text-[rgb(var(--color-primary))]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-3">
                    No Active Plan
                  </h3>
                  <p className="text-[rgb(var(--color-text-secondary))] mb-8 max-w-md mx-auto">
                    You currently don&apos;t have an active subscription
                    package. Upgrade your plan to manage features and enjoy
                    premium benefits.
                  </p>
                  <Button
                    variant="primary"
                    className="px-8 py-3 rounded-xl font-semibold tracking-wide"
                    onClick={onUpgrade}
                  >
                    {t("subscription.khataFree.upgradeToPremium")}
                  </Button>
                </CardBody>
              ) : (
                <>
                  <div className="absolute top-0 right-0 p-4 flex gap-2">
                    {subscription?.status && (
                      <Badge
                        variant={
                          subscription.status === "ACTIVE"
                            ? "success"
                            : "secondary"
                        }
                        className="px-3 py-1 text-xs font-medium uppercase tracking-wider"
                      >
                        {subscription.status}
                      </Badge>
                    )}
                    <Badge
                      variant="primary"
                      className="px-3 py-1 text-sm font-medium"
                    >
                      {planName}
                    </Badge>
                  </div>
                  <CardBody className="p-8">
                    {isKhataFree ? (
                      <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-6 max-w-xl">
                        {t("subscription.khataFree.description")}
                      </p>
                    ) : null}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--color-primary))]/10 flex items-center justify-center border border-[rgb(var(--color-primary))]/20 flex-shrink-0">
                          <ShieldCheck className="w-8 h-8 text-[rgb(var(--color-primary))]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
                            {t("subscription.activePlanTitle")}
                          </h3>
                          {isKhataFree ? (
                            <ul className="text-sm text-[rgb(var(--color-text-secondary))] mt-2 space-y-1 list-disc list-inside">
                              <li>
                                {t("subscription.khataFree.dailyInvoiceLimit")}
                              </li>
                              <li>
                                {t("subscription.khataFree.unlimitedReminders")}
                              </li>
                            </ul>
                          ) : subscription?.packageId?.description ? (
                            <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1 mr-4 max-w-md leading-relaxed">
                              {subscription.packageId.description}
                            </p>
                          ) : null}
                          <div className="flex items-center gap-2 text-sm mt-1.5">
                            {subscription?.startDate && (
                              <span className="text-[rgb(var(--color-text-tertiary))]">
                                Started:{" "}
                                <span className="text-[rgb(var(--color-text-secondary))] font-medium">
                                  {moment(subscription.startDate).format(
                                    "MMM D, YYYY",
                                  )}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {!isKhataFree && (
                        <div className="grid grid-cols-2 md:flex md:items-center gap-8 md:gap-12">
                          <div className="flex flex-col">
                            <span className="text-sm text-[rgb(var(--color-text-secondary))] mb-1.5 flex items-center gap-1.5">
                              <CreditCard className="w-4 h-4" />
                              {t("subscription.planRateLabel")}
                            </span>
                            <span className="text-lg font-medium text-[rgb(var(--color-text-primary))]">
                              {subscription?.paymentId?.currency === "INR"
                                ? "₹"
                                : "$"}
                              {subscription?.paymentId?.amount || "0"}/
                              {t("subscription.monthly").toLowerCase()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {isKhataFree ? (
                      <Button
                        variant="primary"
                        className="px-8 py-3 rounded-xl font-semibold tracking-wide"
                        onClick={onUpgrade}
                      >
                        {t("subscription.khataFree.upgradeToPremium")}
                      </Button>
                    ) : null}

                    {subscription?.features?.length > 0 && (
                      <div className="mt-10">
                        <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                          {t("subscription.includedServicesTitle")}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {subscription.features
                            .filter(
                              (f) =>
                                f.usageType === "UNLIMITED" ||
                                (f.maxLimit ?? 0) > 0,
                            )
                            .slice(0, 8)
                            .map((feature) => (
                              <div
                                key={feature.module}
                                className="flex items-start gap-3 p-3 rounded-lg bg-[rgb(var(--color-bg-secondary))]"
                              >
                                <Info className="w-4 h-4 text-[rgb(var(--color-primary))] mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-[rgb(var(--color-text-primary))] capitalize">
                                    {feature.module.replace(/_/g, " ")}
                                  </p>
                                  <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                                    {t(
                                      `subscription.featureDetails.${feature.module}`,
                                      {
                                        defaultValue: t(
                                          "subscription.featureDetailsFallback",
                                        ),
                                      },
                                    )}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardBody>
                </>
              )}
            </Card>
          </div>
          <ManagementShortcuts />
        </div>
      </div>
    </div>
  );
}
