export function getCapabilityIncludes(feature) {
  const includes = feature?.metadata?.includes;
  return Array.isArray(includes) ? includes : null;
}

/** POS checkout and invoice release share the same billing capability set */
function includesBillingCapability(includes, capability) {
  if (capability !== "pos" && capability !== "release") {
    return includes.includes(capability);
  }
  return includes.includes("pos") || includes.includes("release");
}

export function hasFeatureCapability(feature, capability) {
  if (!feature || !capability) {
    return false;
  }
  // Explicit includes array (even empty) is authoritative — empty = no capabilities
  const includes = getCapabilityIncludes(feature);
  if (includes !== null) {
    return includesBillingCapability(includes, capability);
  }
  // Legacy features without metadata.includes — infer from plan depth
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

/**
 * Whether the plan still has room for `quantity` more units of a feature.
 * `fallbackUsage` covers stale subscription.currentUsage (e.g. live store count).
 */
export function canUseFeatureQuota(
  feature,
  { quantity = 1, fallbackUsage = 0 } = {},
) {
  if (!feature) return false;
  if (feature.usageType === "UNLIMITED" || feature.maxLimit === null) {
    return true;
  }

  const limit = Math.max(0, Number(feature.maxLimit) || 0);
  if (limit === 0) return false;

  const usage = Math.max(
    0,
    Number(feature.currentUsage) || 0,
    Number(fallbackUsage) || 0,
  );

  return usage + quantity <= limit;
}

export function getFeatureFromSubscription(subscription, moduleName) {
  if (!subscription || !moduleName) return null;
  return (subscription.features || []).find((f) => f.module === moduleName) || null;
}
