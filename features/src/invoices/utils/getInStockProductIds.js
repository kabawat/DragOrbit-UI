/** Load product IDs with positive available stock for an invoice selector. */
export async function getInStockProductIds({ execute, inventoryService, storeId }) {
  if (!storeId || !inventoryService?.getInventories) return new Set();

  const productIds = new Set();
  let nextCursor = null;

  try {
    do {
      const result = await execute(
        inventoryService.getInventories({
          store: storeId,
          limit: 500,
          ...(nextCursor ? { nextCursor } : {}),
        }),
        { showToast: false },
      );
      if (!result?.success) return new Set();

      const payload = result.data || {};
      const rows = Array.isArray(payload)
        ? payload
        : payload.inventories || payload.data?.inventories || payload.data || [];

      for (const inventory of rows) {
        const available = Number(
          inventory?.availableQuantity ??
            inventory?.stockSummary?.availableQuantity ??
            0,
        );
        const product = inventory?.product;
        const productId =
          (typeof product === "object" ? product?.id || product?._id : product) ||
          inventory?.productId?.id ||
          inventory?.productId?._id ||
          inventory?.productId;
        if (productId && Number.isFinite(available) && available > 0) {
          productIds.add(String(productId));
        }
      }

      const pagination = result.pagination || payload.pagination || payload.data?.pagination;
      nextCursor = pagination?.hasNextPage
        ? pagination.nextCursor || null
        : null;
    } while (nextCursor);
  } catch {
    return new Set();
  }

  return productIds;
}
