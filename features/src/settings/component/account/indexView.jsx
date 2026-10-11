"use client";
import { Save, Settings } from "lucide-react";
export function AccountSettingsView({ model }) {
  const {
    t,
    AccountPreferencesSection,
    settings,
    isEditing,
    handleOpenEdit,
    handleChange,
    FormDrawer,
    handleCancel,
    handleSave,
    isSaving,
  } = model;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
          {t("settings.accountSettings")}
        </h2>
        <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
          {t("settings.configureAccountPreferences")}
        </p>
      </div>

      {/* Account Preferences Section */}
      <AccountPreferencesSection
        settings={settings}
        isEditing={isEditing}
        onEditClick={handleOpenEdit}
        onChange={handleChange}
      />

      {/* Edit Drawer */}
      <FormDrawer
        isOpen={isEditing}
        onClose={handleCancel}
        title={t("settings.editAccountPreferences")}
        icon={Settings}
        description={t("settings.updateAccountSettings")}
        width="w-full md:w-2/3 lg:w-1/2"
        onSave={handleSave}
        onCancel={handleCancel}
        saveLabel={isSaving ? t("common.saving") : t("common.save")}
        cancelLabel={t("common.cancel")}
        isSaving={isSaving}
        saveIcon={Save}
        saveVariant="primary"
      >
        <AccountPreferencesSection
          settings={settings}
          isEditing={true}
          onChange={handleChange}
        />
      </FormDrawer>

      {/* Toast Container */}
    </div>
  );
}
