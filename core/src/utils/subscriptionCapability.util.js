export function getCapabilityIncludes(feature) {
  const includes = feature?.metadata?.includes;
  return Array.isArray(includes) ? includes : [];
}

export function hasFeatureCapability(feature, capability) {
  if (!feature || !capability) {
    return false;
  }
  const includes = getCapabilityIncludes(feature);
  if (Array.isArray(feature.metadata?.includes)) {
    return includes.includes(capability);
  }
  if (feature.usageType === "UNLIMITED" || feature.maxLimit === null) {
    if (capability === "pos" || capability === "release") {
      return true;
    }
    if (capability === "gst" || capability === "tally") {
      return Boolean(feature.report || feature.analytics);
    }
    if (
      capability === "fifo" ||
      capability === "batches" ||
      capability === "stock_events"
    ) {
      return feature.module === "inventory";
    }
  }
  return false;
}

export function isKhataFreeSubscription(subscription) {
  if (!subscription || subscription.status !== "TRIAL") {
    return false;
  }
  const invoice = subscription.features?.find((f) => f.module === "invoice");
  const reminder = subscription.features?.find(
    (f) => f.module === "payment_reminder",
  );
  return (
    reminder?.usageType === "UNLIMITED" &&
    invoice?.usageType === "DAILY_FIXED" &&
    Number(invoice?.maxLimit) === 30
  );
}
