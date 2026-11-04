import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_VARIANTS_PER_BATCH,
  buildBatchVariantsPayload,
  computeDiscount,
  createEmptyBatchVariant,
  validateBatchVariants,
} from "../variantForm.js";

test("createEmptyBatchVariant creates initial variant card structure", () => {
  const v = createEmptyBatchVariant(0, { sku: "VIVO-V17", mrp: 20000 });
  assert.ok(v.id.startsWith("var_"));
  assert.equal(v.sku, "VIVO-V17-V1");
  assert.equal(v.mrp, 20000);
  assert.equal(v.status, "ACTIVE");
  assert.equal(v.showInCatalog, true);
  assert.deepEqual(v.options, []);
});

test("computeDiscount calculates percentage accurately", () => {
  assert.equal(computeDiscount(20000, 18000), 10);
  assert.equal(computeDiscount(24000, 22000), 8.33);
  assert.equal(computeDiscount(100, 100), 0);
  assert.equal(computeDiscount(100, 120), 0);
});

test("buildBatchVariantsPayload matches exact retailer API schema", () => {
  const payload = buildBatchVariantsPayload({
    store: "storeId",
    product: "productId",
    variants: [
      {
        displayName: "vivo v17 128GB",
        mrp: 20000,
        sellingPrice: 18000,
        showInCatalog: true,
        sku: "VIVO-V17-128",
        sortOrder: 0,
        status: "ACTIVE",
        barcode: "8901234567890",
        discount: 10,
        stock: 10,
        purchasePrice: 15000,
        supplierId: "supplierId",
      },
      {
        displayName: "vivo v17 256GB",
        mrp: 24000,
        sellingPrice: 22000,
        showInCatalog: true,
        sku: "VIVO-V17-256",
        sortOrder: 1,
        status: "ACTIVE",
        barcode: "8901234567891",
        discount: 8.33,
        stock: "", // no stock
      },
    ],
  });

  assert.equal(payload.store, "storeId");
  assert.equal(payload.product, "productId");
  assert.equal(payload.variants.length, 2);

  // Variant 1 with stock
  const v1 = payload.variants[0];
  assert.equal(v1.displayName, "vivo v17 128GB");
  assert.equal(v1.mrp, 20000);
  assert.equal(v1.sellingPrice, 18000);
  assert.equal(v1.showInCatalog, true);
  assert.equal(v1.sku, "VIVO-V17-128");
  assert.equal(v1.sortOrder, 0);
  assert.equal(v1.status, "ACTIVE");
  assert.equal(v1.barcode, "8901234567890");
  assert.equal(v1.discount, 10);
  assert.deepEqual(v1.stock, {
    stock: 10,
    purchasePrice: 15000,
    supplier: "supplierId",
  });

  // Variant 2 without stock
  const v2 = payload.variants[1];
  assert.equal(v2.displayName, "vivo v17 256GB");
  assert.equal(v2.mrp, 24000);
  assert.equal(v2.sellingPrice, 22000);
  assert.equal(v2.showInCatalog, true);
  assert.equal(v2.sku, "VIVO-V17-256");
  assert.equal(v2.sortOrder, 1);
  assert.equal(v2.status, "ACTIVE");
  assert.equal(v2.barcode, "8901234567891");
  assert.equal(v2.discount, 8.33);
  assert.equal(v2.stock, null);
});

test("validateBatchVariants validates product and max 5 variants", () => {
  const missingProd = validateBatchVariants({ product: "", variants: [{}] });
  assert.equal(missingProd.isValid, false);
  assert.ok(missingProd.errors.product);

  const emptyVars = validateBatchVariants({ product: "p-1", variants: [] });
  assert.equal(emptyVars.isValid, false);
  assert.ok(emptyVars.errors.variants);

  const sixVars = [
    { displayName: "1", mrp: 10, sellingPrice: 5 },
    { displayName: "2", mrp: 10, sellingPrice: 5 },
    { displayName: "3", mrp: 10, sellingPrice: 5 },
    { displayName: "4", mrp: 10, sellingPrice: 5 },
    { displayName: "5", mrp: 10, sellingPrice: 5 },
    { displayName: "6", mrp: 10, sellingPrice: 5 },
  ];
  const maxExceeded = validateBatchVariants({ product: "p-1", variants: sixVars });
  assert.equal(maxExceeded.isValid, false);
  assert.match(maxExceeded.errors.variants, /Maximum 5 variants/);

  const dupSku = validateBatchVariants({
    product: "p-1",
    variants: [
      { displayName: "1", mrp: 10, sellingPrice: 5, sku: "SAME-SKU" },
      { displayName: "2", mrp: 10, sellingPrice: 5, sku: "SAME-SKU" },
    ],
  });
  assert.equal(dupSku.isValid, false);
  assert.ok(dupSku.variantErrors[1].sku);
});
