"use client";
import { Lightbulb, Plus } from "lucide-react";
import { Button, SideDrawer } from "@dragorbit/ui";
export function CreateSuggestionDrawerView({ model }) {
  const {
    isOpen,
    onClose,
    t,
    handleSubmit,
    SuggestionForm,
    formData,
    handleFormChange,
    isSubmitting,
  } = model;
  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={t("suggestions.submitNew") || "Submit New Suggestion"}
      description={t("suggestions.description") || "Help us improve DragBizz"}
      icon={Lightbulb}
      width="w-full sm:max-w-[480px] md:max-w-[768px]"
    >
      <div className="p-3 sm:p-4 md:p-6 h-full">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SuggestionForm formData={formData} onChange={handleFormChange} />

          <div className="flex-shrink-0 bg-[rgb(var(--color-bg-primary))] border-t border-[rgb(var(--color-border-primary))] p-3 sm:p-4 -mx-3 sm:-mx-4 md:-mx-6 -mb-3 sm:-mb-4 md:-mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-2 sm:gap-3">
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto"
              loading={isSubmitting}
              leftIcon={Plus}
            >
              {t("suggestions.form.submit") || "Submit Idea"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("suggestions.form.cancel") || "Cancel"}
            </Button>
          </div>
        </form>
      </div>
    </SideDrawer>
  );
}
