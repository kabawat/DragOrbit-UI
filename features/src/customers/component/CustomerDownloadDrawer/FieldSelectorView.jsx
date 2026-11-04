"use client";
import { Checkbox } from "@dragorbit/ui";
export function CustomerDownloadDrawerFieldSelectorPresentation({ model }) {
  const {
    t,
    onSelectAll,
    onDeselectAll,
    availableFields,
    selectedFields,
    onFieldToggle,
  } = model;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))]">
          {t("customers.selectFields")}
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-xs font-medium px-2 py-1 rounded text-[rgb(var(--color-primary))]  hover:bg-opacity-10 transition-colors duration-200"
          >
            {t("customers.selectAll")}
          </button>
          <span className="text-[rgb(var(--color-text-secondary))] text-xs">
            |
          </span>
          <button
            type="button"
            onClick={onDeselectAll}
            className="text-xs font-medium px-2 py-1 rounded text-[rgb(var(--color-primary))]  hover:bg-opacity-10 transition-colors duration-200"
          >
            {t("customers.deselectAll")}
          </button>
        </div>
      </div>
      <div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border-primary))] rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-2">
          {availableFields.map((field) => {
            const isChecked = selectedFields.includes(field.key);
            return (
              <div
                key={field.key}
                className="rounded-lg transition-all duration-200"
              >
                <div className="[&>div]:!items-center [&>div]:!space-x-2.5">
                  <Checkbox
                    checked={isChecked}
                    onChange={() => onFieldToggle(field.key)}
                    label={field.label}
                    id={`field-${field.key}`}
                    className={
                      isChecked
                        ? "[&_label]:!text-[rgb(var(--color-primary))] [&_label]:!font-medium"
                        : ""
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-[rgb(var(--color-text-secondary))]">
          {t("customers.selectedFieldsCount", { count: selectedFields.length })}
        </p>
        {selectedFields.length === availableFields.length && (
          <span className="text-xs text-[rgb(var(--color-primary))] font-medium">
            {t("customers.allFieldsSelected")}
          </span>
        )}
      </div>
    </div>
  );
}
