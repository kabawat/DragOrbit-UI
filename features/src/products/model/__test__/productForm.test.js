import assert from "node:assert/strict";
import test from "node:test";
import {
  buildUnifiedProductPayload,
  calculateSavings,
  computeDiscount,
  createEmptyVariant,
  generateAutoSku,
  getInitialProductFormData,
  validateProductForm,
  validateVariants,
} from "../productForm.js";

test("getInitialProductFormData initializes default state with storeId", () => {
  const initial = getInitialProductFormData("store-123");
  assert.equal(initial.store, "store-123");
  assert.equal(initial.currency, "INR");
  assert.equal(initial.uom, "PCS");
  assert.equal(initial.status, "ACTIVE");
  assert.equal(initial.showInCatalog, true);
  assert.deepEqual(initial.images, []);
});

test("createEmptyVariant generates valid initial variant structure", () => {
  const variant = createEmptyVariant(1, { store: "store-abc", sku: "PRD-10" });
  assert.ok(variant.id.startsWith("var_"));
  assert.equal(variant.sku, "PRD-10-V2");
  assert.equal(variant.status, "ACTIVE");
  assert.deepEqual(variant.options, []);
});

test("calculateSavings computes correct amount and percentage", () => {
  const res1 = calculateSavings("1000", "800");
  assert.equal(res1.amount, "200.00");
  assert.equal(res1.percentage, 20);

  const res2 = calculateSavings("500", "500");
  assert.equal(res2.amount, "0.00");
  assert.equal(res2.percentage, 0);

  const res3 = calculateSavings("", "");
  assert.equal(res3.percentage, 0);
});

test("generateAutoSku generates non-empty uppercase SKU with hyphens", () => {
  const sku = generateAutoSku("Premium T-Shirt");
  assert.match(sku, /^PREM-\d{4}$/);
});

test("validateProductForm checks required fields and mrp/sellingPrice constraint", () => {
  const invalid = validateProductForm({}, null);
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.fields.name);
  assert.ok(invalid.fields.category);
  assert.ok(invalid.fields.mrp);
  assert.ok(invalid.fields.sellingPrice);

  const priceMismatch = validateProductForm(
    {
      name: "Test",
      category: "cat-1",
      mrp: "100",
      sellingPrice: "200",
    },
    "store-1"
  );
  assert.equal(priceMismatch.isValid, false);
  assert.match(priceMismatch.fields.sellingPrice, /cannot exceed MRP/i);

  const valid = validateProductForm(
    {
      name: "Test Product",
      category: "cat-1",
      mrp: "100",
      sellingPrice: "80",
    },
    "store-1"
  );
  assert.equal(valid.isValid, true);
  assert.deepEqual(valid.fields, {});
});

test("validateVariants flags variants whose sellingPrice exceeds MRP", () => {
  const base = { mrp: "100", sellingPrice: "90" };
  const variants = [
    { mrp: "120", sellingPrice: "100" },
    { mrp: "150", sellingPrice: "160" },
  ];
  const res = validateVariants(variants, base);
  assert.equal(res.isValid, false);
  assert.equal(res.index, 1);
  assert.match(res.error, /Variant #3/);

  const validRes = validateVariants([{ mrp: "150", sellingPrice: "140" }], base);
  assert.equal(validRes.isValid, true);
});

test("buildUnifiedProductPayload: single product mode creates 1 default variant with isDefault: true", () => {
  const payload = buildUnifiedProductPayload({
    formData: {
      name: "Single Shirt",
      category: "cat-cloth",
      store: "store-1",
      mrp: 500,
      sellingPrice: 400,
      stock: 10,
      purchasePrice: 250,
      sku: "SHIRT-01",
    },
    hasVariants: false,
    variants: [],
  });

  assert.equal(payload.name, "Single Shirt");
  assert.equal(payload.mrp, undefined);
  assert.equal(payload.sellingPrice, undefined);
  assert.equal(payload.discount, undefined);
  assert.equal(payload.sku, undefined);
  assert.equal(payload.barcode, undefined);
  assert.equal(payload.basePrice, undefined);
  assert.equal(payload.variants.length, 1);

  const defaultVar = payload.variants[0];
  assert.equal(defaultVar.displayName, "Single Shirt");
  assert.equal(defaultVar.isDefault, true);
  assert.equal(defaultVar.sellingPrice, 400);
  assert.equal(defaultVar.mrp, 500);
  assert.equal(defaultVar.discount, 20);
  assert.equal(defaultVar.sku, "SHIRT-01");
  assert.equal(defaultVar.stock.stock, 10);
  assert.equal(defaultVar.stock.purchasePrice, 250);
});

test("buildUnifiedProductPayload: multi-variant mode sets displayName from variant input and NO isDefault", () => {
  const payload = buildUnifiedProductPayload({
    formData: {
      name: "Polo T-Shirt",
      displayName: "Red - M",
      category: "cat-cloth",
      store: "store-1",
      mrp: 600,
      sellingPrice: 500,
      stock: 5,
      purchasePrice: 300,
      sku: "POLO-RED-M",
    },
    hasVariants: true,
    variants: [
      {
        displayName: "Blue - L",
        mrp: 650,
        sellingPrice: 550,
        stock: 8,
        purchasePrice: 320,
        sku: "POLO-BLU-L",
        options: [
          { name: "Color", value: "Blue" },
          { name: "Size", value: "L" },
        ],
      },
    ],
  });

  assert.equal(payload.name, "Polo T-Shirt");
  assert.equal(payload.mrp, undefined);
  assert.equal(payload.sellingPrice, undefined);
  assert.equal(payload.discount, undefined);
  assert.equal(payload.sku, undefined);
  assert.equal(payload.barcode, undefined);
  assert.equal(payload.basePrice, undefined);
  assert.equal(payload.variants.length, 2);

  // Variant 1
  const var1 = payload.variants[0];
  assert.equal(var1.displayName, "Red - M");
  assert.equal(var1.isDefault, undefined);
  assert.equal(var1.sortOrder, 0);
  assert.equal(var1.mrp, 600);
  assert.equal(var1.sellingPrice, 500);
  assert.equal(var1.stock.stock, 5);
  assert.equal(var1.stock.purchasePrice, 300);

  // Variant 2
  const var2 = payload.variants[1];
  assert.equal(var2.displayName, "Blue - L");
  assert.equal(var2.isDefault, undefined);
  assert.equal(var2.sortOrder, 1);
  assert.equal(var2.mrp, 650);
  assert.equal(var2.sellingPrice, 550);
  assert.equal(var2.stock.stock, 8);
  assert.equal(var2.stock.purchasePrice, 320);
  assert.deepEqual(var2.options, [
    { name: "Color", value: "Blue" },
    { name: "Size", value: "L" },
  ]);
});

test("buildUnifiedProductPayload: strips product name prefix so only typed variant name is passed", () => {
  const payload = buildUnifiedProductPayload({
    formData: {
      name: "Vivo y12",
      displayName: "Vivo y12 128GB",
      category: "cat-mobile",
      store: "store-1",
      mrp: 12000,
      sellingPrice: 10000,
      stock: 10,
      purchasePrice: 8000,
    },
    hasVariants: true,
    variants: [
      {
        displayName: "Vivo y12 64GB",
        mrp: 10000,
        sellingPrice: 8500,
      },
    ],
  });

  assert.equal(payload.name, "Vivo y12");
  assert.equal(payload.variants.length, 2);
  assert.equal(payload.variants[0].displayName, "128GB");
  assert.equal(payload.variants[1].displayName, "64GB");
});
