"use client";
import { X } from "lucide-react";
export function ProductSectionInfoModalPresentation({ model }) {
  const { sectionInfo, onClose, t } = model;
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-4 z-[9999]">
      <div className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))] shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
              {sectionInfo.title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 cursor-pointer hover:bg-[rgb(var(--color-bg-secondary))] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-[rgb(var(--color-text-secondary))]">
              {sectionInfo.description}
            </p>

            <div>
              <h4 className="text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
                {t("products.fieldsInThisSection")}
              </h4>
              <ul className="space-y-1">
                {sectionInfo.details.map((detail, index) => (
                  <li
                    key={index}
                    className="text-sm text-[rgb(var(--color-text-secondary))] flex items-start"
                  >
                    <span className="w-2 h-2 bg-[rgb(var(--color-primary))] rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-[rgb(var(--color-bg-secondary))] rounded-lg border border-[rgb(var(--color-border-primary))]">
              <p className="text-sm text-[rgb(var(--color-text-primary))] font-medium">
                💡 Tip: {sectionInfo.tips}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
