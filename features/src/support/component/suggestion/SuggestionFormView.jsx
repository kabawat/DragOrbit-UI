"use client";
import { Input, Select, Textarea } from "@dragorbit/ui";
export function SuggestionFormView({ model }) {
  const { t, formData, onChange, categoryOptions } = model;
  return (
    <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 min-h-0 pr-1">
      <Input
        label={t("suggestions.form.title") || "Idea Title"}
        required
        placeholder={
          t("suggestions.form.titlePlaceholder") || "Enter a brief title"
        }
        value={formData.title}
        onChange={(val) => onChange("title", val)}
      />

      <Select
        label={t("suggestions.form.category") || "Category"}
        options={categoryOptions}
        value={formData.category}
        onChange={(val) => onChange("category", val)}
        required
        searchable={true}
      />

      <Textarea
        label={t("suggestions.form.description") || "Detailed Description"}
        required
        rows={8}
        placeholder={
          t("suggestions.form.descriptionPlaceholder") ||
          "Describe your idea and why it's important..."
        }
        value={formData.description}
        onChange={(val) => onChange("description", val)}
        resize="none"
      />
    </div>
  );
}
