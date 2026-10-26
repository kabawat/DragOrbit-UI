import { Children, cloneElement, createElement, isValidElement } from "react";

function getCells(row) {
  return Children.toArray(row?.props?.children).filter(
    (child) => isValidElement(child) && ["td", "th"].includes(child.type),
  );
}

function readText(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(readText).join(" ");
  if (isValidElement(node)) return readText(node.props.children);
  return "";
}

function rowContainsQuantity(row) {
  const text = readText(row?.props?.children).toLowerCase();
  return text.includes("total quantity") || text.includes("total qty");
}

export function appendTotalQuantityRow(children, totalQuantity) {
  let inserted = false;

  function visit(node) {
    if (Array.isArray(node)) return node.map(visit);
    if (!isValidElement(node)) return node;

    if (!inserted && node.type === "table") {
      const tableChildren = Children.toArray(node.props.children);
      const footerIndex = tableChildren.findIndex((child) => isValidElement(child) && child.type === "tfoot");
      const footer = footerIndex >= 0 ? tableChildren[footerIndex] : null;
      const footerRows = Children.toArray(footer?.props?.children);
      if (footerRows.some(rowContainsQuantity)) {
        inserted = true;
        return node;
      }

      const header = tableChildren.find((child) => isValidElement(child) && child.type === "thead");
      const headerRow = Children.toArray(header?.props?.children).find((row) => isValidElement(row) && row.type === "tr");
      const footerRow = footerRows.find((row) => isValidElement(row) && row.type === "tr");
      const columnCount = getCells(footerRow || headerRow).reduce(
        (count, cell) => count + Number(cell.props.colSpan || 1),
        0,
      ) || 2;
      const quantityRow = createElement(
        "tr",
        { className: "invoice-common-total-quantity", key: "invoice-common-total-quantity" },
        createElement("td", { colSpan: Math.max(columnCount - 1, 1) }, "Total Quantity"),
        createElement("td", { className: "invoice-common-total-quantity-value" }, totalQuantity),
      );

      if (footer) {
        tableChildren[footerIndex] = cloneElement(footer, {
          children: [...footerRows, quantityRow],
        });
      } else {
        tableChildren.push(createElement("tfoot", { key: "invoice-common-total-quantity-footer" }, quantityRow));
      }
      inserted = true;
      return cloneElement(node, { children: tableChildren });
    }

    if (!node.props?.children) return node;
    return cloneElement(node, { children: visit(node.props.children) });
  }

  return { children: visit(children), inserted };
}

export function placeInvoiceExtrasBeforeFooter(children, extras) {
  let inserted = false;

  function visit(node) {
    if (Array.isArray(node)) return node.flatMap((child) => visit(child));
    if (!isValidElement(node)) return node;

    const classNames = String(node.props?.className || "").split(/\s+/);
    const isTemplateFooter = classNames.some((className) => /(^|[_-])footer([_-]|$)/i.test(className));
    if (!inserted && isTemplateFooter) {
      inserted = true;
      return [extras, node];
    }
    if (!node.props?.children) return node;
    return cloneElement(node, { children: visit(node.props.children) });
  }

  const placed = visit(children);
  return { children: inserted ? placed : [placed, extras], inserted };
}
