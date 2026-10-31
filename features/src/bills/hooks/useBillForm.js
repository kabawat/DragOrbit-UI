"use client";
import { useCallback, useMemo, useState } from "react";
import { resolveProductPurchasePrice, calculateBillSummary } from "../utils/billUtils.js";

export const INITIAL_BILL_FORM = {
  supplier: "",
  purchaseOrder: "",
  dueDate: "",
  notes: "",
  goodsReceived: true,
  items: [],
};

export function useBillForm(initialState = INITIAL_BILL_FORM) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Item selector state
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(0);

  // Field updater
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "supplier" && prev.supplier !== value) {
        next.purchaseOrder = "";
      }
      return next;
    });

    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // Update product selection and auto-fill price
  const handleSelectProduct = useCallback((productId, products = []) => {
    setSelectedProduct(productId);
    if (!productId) {
      setSelectedPrice(0);
      return;
    }
    const product = products.find((p) => (p.id || p._id) === productId);
    if (product) {
      const price = resolveProductPurchasePrice(product);
      setSelectedPrice(price);
    }
  }, []);

  // Add item to list
  const handleAddItem = useCallback(
    (products = [], showError = () => {}) => {
      if (!selectedProduct) {
        showError("Please select a product");
        return false;
      }

      const product = products.find((p) => (p.id || p._id) === selectedProduct);
      if (!product) {
        showError("Product not found");
        return false;
      }

      const quantityToAdd = Math.max(1, parseInt(selectedQuantity, 10) || 1);
      const priceToAdd = Math.max(0, parseFloat(selectedPrice) || 0);

      const newItem = {
        product: selectedProduct,
        productName: product.name || product.productName || "Product",
        quantity: quantityToAdd,
        purchasePrice: priceToAdd,
        uom: product.uom || product.pricing?.uom || "PCS",
      };

      setFormData((prev) => {
        // If the same product already exists in items, merge quantity
        const existingIndex = prev.items.findIndex(
          (it) => it.product === selectedProduct
        );

        if (existingIndex > -1) {
          const updated = [...prev.items];
          const existing = updated[existingIndex];
          updated[existingIndex] = {
            ...existing,
            quantity: existing.quantity + quantityToAdd,
            purchasePrice: priceToAdd || existing.purchasePrice,
          };
          return { ...prev, items: updated };
        }

        return { ...prev, items: [...prev.items, newItem] };
      });

      // Reset selection
      setSelectedProduct("");
      setSelectedQuantity(1);
      setSelectedPrice(0);
      return true;
    },
    [selectedProduct, selectedQuantity, selectedPrice]
  );

  // Remove item by index
  const handleRemoveItem = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  // Inline update item (e.g. quantity or price edit)
  const handleUpdateItem = useCallback((index, updates = {}) => {
    setFormData((prev) => {
      if (!prev.items[index]) return prev;
      const updated = [...prev.items];
      updated[index] = { ...updated[index], ...updates };
      return { ...prev, items: updated };
    });
  }, []);

  // Form validation
  const validateForm = useCallback(
    (t = (k) => k) => {
      const newErrors = {};

      if (!formData.supplier) {
        newErrors.supplier = t("errors.supplierRequired") || "Supplier is required";
      }

      if (formData.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(formData.dueDate) < today) {
          newErrors.dueDate =
            t("errors.dueDateCannotBeInPast") || "Due date cannot be in the past";
        }
      }

      if (formData.notes && formData.notes.length > 500) {
        newErrors.notes =
          t("errors.notesCannotExceed500Chars") ||
          "Notes cannot exceed 500 characters";
      }

      if (!formData.items || formData.items.length === 0) {
        newErrors.items =
          t("errors.atLeastOneItemRequired") || "At least one item is required";
      }

      formData.items.forEach((item, index) => {
        if (!item.product) {
          newErrors[`item_${index}_product`] = "Product is required";
        }
        if (
          !item.quantity ||
          item.quantity <= 0 ||
          !Number.isInteger(Number(item.quantity))
        ) {
          newErrors[`item_${index}_quantity`] =
            "Valid quantity (integer > 0) is required";
        }
        if (
          item.purchasePrice === undefined ||
          item.purchasePrice === null ||
          item.purchasePrice < 0
        ) {
          newErrors[`item_${index}_purchasePrice`] =
            "Valid purchase price (>= 0) is required";
        }
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  // Build clean bill payload for API submission
  const buildBillPayload = useCallback(
    (storeId) => {
      return {
        store: storeId,
        supplier: formData.supplier,
        purchaseOrder: formData.purchaseOrder || undefined,
        goodsReceived: !!formData.goodsReceived,
        items: formData.items.map((item) => ({
          product: item.product,
          quantity: parseInt(item.quantity, 10),
          purchasePrice: parseFloat(item.purchasePrice) || 0,
        })),
        dueDate: formData.dueDate || undefined,
        notes: formData.notes || undefined,
      };
    },
    [formData]
  );

  const summary = useMemo(
    () => calculateBillSummary(formData.items),
    [formData.items]
  );

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    selectedProduct,
    setSelectedProduct,
    selectedQuantity,
    setSelectedQuantity,
    selectedPrice,
    setSelectedPrice,
    handleInputChange,
    handleSelectProduct,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItem,
    validateForm,
    buildBillPayload,
    summary,
  };
}

export default useBillForm;
