"use client";

import { Sliders } from "lucide-react";
import { useEffect, useState } from "react";
import { DragAiAvatar } from "./DragAiAvatar.jsx";
import { DragBizzLogoIcon } from "./DragBizzLogoIcon.jsx";

export const TOOL_TITLE_MAP = {
  // Sales & Invoices
  today_sale: "Fetching today's sales & revenue records…",
  sales_summary: "Fetching sales summary & performance…",
  list_invoices: "Fetching sales & invoice records…",
  get_invoice_detail: "Fetching invoice details…",
  sales_pareto: "Calculating sales Pareto & profit analysis…",
  dead_stock: "Analyzing slow-moving & dead stock…",
  sales_order_summary: "Fetching sales orders summary…",
  list_sales_orders: "Fetching sales order records…",
  get_sales_order_detail: "Fetching sales order details…",
  create_invoice_draft: "Preparing invoice draft…",
  release_invoice: "Finalizing and releasing invoice…",

  // Inventory & Stock
  stock_summary: "Checking current stock & inventory levels…",
  search_product: "Searching product catalog…",
  list_products: "Fetching product details & catalog…",
  get_product_detail: "Fetching product details…",
  low_stock_alerts: "Checking low stock alerts…",
  stock_movement: "Checking stock movement history…",
  category_list: "Fetching product categories…",
  add_stock: "Preparing stock update…",
  create_product: "Preparing product details…",
  update_product: "Updating product details…",

  // Customers & Khata
  customer_summary: "Fetching customer accounts & dues…",
  search_customer: "Searching customer directory…",
  list_customer_accounts: "Fetching customer account details…",
  get_customer_ledger: "Preparing customer ledger & statement…",
  customer_dossier: "Compiling customer profile & history…",
  overdue_customers: "Checking overdue customer balances…",
  payment_reminders: "Checking payment reminders…",
  customer_stats: "Analyzing customer statistics…",
  create_customer: "Preparing customer details…",
  ledger_debit: "Preparing customer debit entry…",
  ledger_credit: "Preparing customer payment credit…",

  // Suppliers & Procurement
  supplier_summary: "Checking supplier and purchase records…",
  search_supplier: "Searching supplier directory…",
  list_suppliers: "Fetching supplier list…",
  get_supplier_detail: "Fetching supplier details…",
  purchase_order_summary: "Checking purchase order summary…",
  list_purchase_orders: "Fetching purchase order records…",
  get_purchase_order_detail: "Fetching purchase order details…",
  supplier_bills: "Checking supplier bills & dues…",
  create_supplier: "Preparing supplier details…",
  create_purchase_order: "Preparing purchase order…",

  // Expenses & Finance
  expense_summary: "Fetching expense records…",
  list_expenses: "Fetching expense records…",
  cashbook_summary: "Checking cashbook & cashflow records…",
  gst_summary: "Calculating GST & tax summary…",
  create_expense: "Preparing expense details…",
  update_expense: "Updating expense details…",

  // General & Analytics
  store_brief: "Fetching store overview & performance…",
  detailed_analytics: "Compiling store analytics & metrics…",
  list_staff: "Fetching staff directory…",
  export_report: "Preparing report export…",
};

export function formatToolTitle(toolName) {
  if (!toolName) return "Querying store database…";
  if (TOOL_TITLE_MAP[toolName]) return TOOL_TITLE_MAP[toolName];
  return `Processing ${String(toolName).replace(/_/g, " ")}…`;
}

export function AgentActivityCard({ activeTool, progress, isConfirming }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  let statusText = "Thinking…";
  let isDataOp = false;

  if (isConfirming) {
    statusText = "Executing approved action and updating store…";
    isDataOp = true;
  } else if (progress?.label) {
    statusText = progress.label;
    isDataOp = progress.stage === "tool_executing";
  } else if (activeTool) {
    statusText = formatToolTitle(activeTool);
    isDataOp = true;
  } else if (elapsed >= 1) {
    statusText = "Understanding your request…";
    isDataOp = false;
  }

  return (
    <div className="flex animate-[chatFadeUp_0.25s_ease-out_both] flex-col items-start gap-2.5 w-full my-2">
      <div className="flex items-center gap-2 select-none">
        <DragAiAvatar isThinking={true} />
        <span className="text-[13px] font-bold tracking-tight text-[rgb(var(--color-primary))]">
          DragAI
        </span>
        <span className="text-[11px] font-medium text-[rgb(var(--color-text-tertiary))] ml-0.5">
          {elapsed}s
        </span>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between rounded-xl bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] px-4 py-2.5 shadow-2xs transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]">
              {isDataOp ? (
                <Sliders className="h-4 w-4" />
              ) : (
                <DragBizzLogoIcon className="h-4 w-4" color="currentColor" />
              )}
            </div>
            <span className="truncate text-[13.5px] font-medium text-[rgb(var(--color-text-primary))]">
              {statusText}
            </span>
          </div>
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            <span className="h-5 w-5 rounded-full border-2 border-[rgb(var(--color-primary))] border-t-transparent animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentActivityCard;

