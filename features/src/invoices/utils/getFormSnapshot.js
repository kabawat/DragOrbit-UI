export function getFormSnapshot(data) {
  if (!data) return "";
  return JSON.stringify({
    customer: String(
      data.customer?._id || data.customer?.id || data.customer || ""
    ),
    totalDiscount: Number(data.totalDiscount) || 0,
    discountMode: String(data.discountMode || "POST_TOTAL"),
    orderSource: String(data.orderSource || "POS"),
    items: (data.items || []).map((item) => {
      const pId =
        typeof item.product === "object"
          ? item.product?._id || item.product?.id
          : item.product;
      const vId =
        typeof item.variant === "object"
          ? item.variant?._id || item.variant?.id
          : item.variant;
      return {
        product: String(pId || ""),
        variant: String(vId || ""),
        quantity: Number(item.quantity) || 0,
        price: Number(item.price) || 0,
        uom: String(item.uom || ""),
      };
    }),
  });
}

export function isFormSnapshotEqual(dataA, dataB) {
  return getFormSnapshot(dataA) === getFormSnapshot(dataB);
}
