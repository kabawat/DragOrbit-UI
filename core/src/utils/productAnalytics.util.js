export const DEFAULT_PRODUCT_TOTALS = {
  totalProducts: 0,
  activeProducts: 0,
  inactiveProducts: 0,
};

export function normalizeProductAnalytics(data) {
  const source = data && typeof data === "object" ? data : {};
  return {
    ...source,
    totals: {
      ...DEFAULT_PRODUCT_TOTALS,
      ...(source.totals && typeof source.totals === "object"
        ? source.totals
        : {}),
    },
  };
}
