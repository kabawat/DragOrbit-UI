import { Fragment, cloneElement, createElement, isValidElement } from "react";

export function placeInvoiceExtrasBeforeFooter(children, extras) {
  let inserted = false;

  function visit(node) {
    if (Array.isArray(node)) return node.flatMap((child) => visit(child));
    if (!isValidElement(node)) return node;

    const classNames = String(node.props?.className || "").split(/\s+/);
    const isTemplateFooter = classNames.some((className) => /(^|[_-])footer([_-]|$)/i.test(className));
    if (!inserted && isTemplateFooter) {
      inserted = true;
      return createElement(Fragment, { key: "invoice-extras-before-footer" }, extras, node);
    }
    if (!node.props?.children) return node;
    return cloneElement(node, { children: visit(node.props.children) });
  }

  const placed = visit(children);
  return {
    children: inserted
      ? placed
      : createElement(Fragment, { key: "invoice-extras-after-content" }, placed, extras),
    inserted,
  };
}
