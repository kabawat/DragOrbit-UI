import { Children, Fragment, cloneElement, createElement, isValidElement } from "react";

export function placeInvoiceExtrasBeforeFooter(children, extras, acknowledgement = null) {
  let inserted = false;
  const hasDedicatedSlot = containsExtrasSlot(children);

  function containsExtrasSlot(node) {
    if (Array.isArray(node)) return node.some(containsExtrasSlot);
    if (!isValidElement(node)) return false;
    return Boolean(node.props?.["data-invoice-extras-slot"]) || containsExtrasSlot(node.props?.children);
  }

  function visit(node) {
    // Cloning children turns JSX's static sibling array into a runtime array.
    // Normalize it first so every cloned sibling receives a stable, unique key.
    if (Array.isArray(node)) {
      return Children.toArray(node).map((child) => visit(child));
    }
    if (!isValidElement(node)) return node;

    if (node.props?.["data-invoice-extras-slot"]) {
      inserted = true;
      return cloneElement(node, {}, createElement(Fragment, null, extras, acknowledgement));
    }

    const classNames = String(node.props?.className || "").split(/\s+/);
    const isTemplateFooter = classNames.some((className) => {
      const normalized = className.toLowerCase().replace(/_[a-z0-9]{4,}$/i, "").replace(/^[^a-z]+/, "");
      if (normalized.startsWith("tablefooter") || /footer(?:row|cell|head)/i.test(normalized)) return false;
      return normalized === "footer" || normalized.endsWith("footer") || normalized.startsWith("footer");
    });
    if (!hasDedicatedSlot && !inserted && isTemplateFooter) {
      inserted = true;
      return createElement(Fragment, { key: "invoice-extras-around-footer" }, extras, node, acknowledgement);
    }
    if (!node.props?.children) return node;
    return cloneElement(node, { children: visit(node.props.children) });
  }

  const placed = visit(children);
  return {
    children: inserted
      ? placed
      : createElement(Fragment, { key: "invoice-extras-after-content" }, placed, extras, acknowledgement),
    inserted,
  };
}
