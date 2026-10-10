"use client";

import { Download, Upload, Plus, Search, RotateCcw } from "lucide-react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { Button } from "../components/button/Button";
import type { ButtonProps } from "../components/button/Button";

export type TableToolbarAction = {
  label: string;
  onClick: () => void;
  hidden?: boolean;
  disabled?: boolean;
  loading?: boolean;
  badge?: ReactNode;
  variant?: ButtonProps["variant"];
};
export type TableToolbarProps = {
  title?: ReactNode;
  description?: ReactNode;
  search?: { value: string; onChange: (value: string) => void; label: string; placeholder?: string; inputProps?: Omit<ComponentPropsWithRef<"input">, "value" | "onChange" | "type" | "aria-label"> };
  searchSlot?: ReactNode;
  filters?: ReactNode;
  clearFilters?: { label: string; onClick: () => void; visible: boolean };
  download?: TableToolbarAction;
  upload?: TableToolbarAction;
  create?: TableToolbarAction;
  actions?: ReactNode;
  viewSwitcher?: ReactNode;
  className?: string;
};

export function TableToolbar({ title, description, search, searchSlot, filters, clearFilters, download, upload, create, actions, viewSwitcher, className = "" }: TableToolbarProps) {
  const actionButton = (action: TableToolbarAction | undefined, Icon: typeof Download, primary = false) => action && !action.hidden ? <div className="relative"><Button onClick={action.onClick} disabled={action.disabled} loading={action.loading} leftIcon={Icon} variant={action.variant ?? (primary ? "primary" : "secondary")}>{action.label}</Button>{action.badge}</div> : null;
  return <div className={`p-5 space-y-4 ${className}`}>
    {(title || description) && <div>{title && <h2 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">{title}</h2>}{description && <p className="text-sm text-[rgb(var(--color-text-secondary))]">{description}</p>}</div>}
    <div className="flex flex-col xl:flex-row xl:items-center gap-4">
      <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
        {searchSlot ?? (search && <div className="relative flex-1 min-w-[200px] max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-secondary))] pointer-events-none" aria-hidden="true" /><input {...search.inputProps} type="search" aria-label={search.label} value={search.value} onChange={event => search.onChange(event.target.value)} placeholder={search.placeholder} className={`w-full rounded-lg border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] ${search.inputProps?.className ?? ""}`} /></div>)}
        {filters}
        {clearFilters?.visible && <Button variant="ghost" leftIcon={RotateCcw} onClick={clearFilters.onClick}>{clearFilters.label}</Button>}
      </div>
      <div className="flex flex-wrap items-center gap-3 shrink-0">{viewSwitcher}{actionButton(upload, Upload)}{actionButton(download, Download)}{actions}{actionButton(create, Plus, true)}</div>
    </div>
  </div>;
}
