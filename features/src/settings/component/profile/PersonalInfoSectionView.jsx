"use client";
import { Edit2, Mail, Phone, User } from "lucide-react";
export function PersonalInfoSectionView({ model }) {
  const { t, onEditClick, PersonalInfoCard, form, apiUser, user } = model;
  return (
    <div className="bg-[rgb(var(--color-bg-primary))]/20 backdrop-blur-md rounded-lg border border-[rgb(var(--color-border-primary))]/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
          {t("settings.personalInformation")}
        </h3>
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-lg"
        >
          <Edit2 className="w-4 h-4" />
          {t("settings.editProfile")}
        </button>
      </div>

      {/* Read-only view */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonalInfoCard
          icon={User}
          label={t("settings.fullName")}
          value={
            form.firstName || form.lastName
              ? `${form.firstName || ""} ${form.lastName || ""}`.trim()
              : "-"
          }
        />

        <PersonalInfoCard
          icon={Mail}
          label={t("settings.email")}
          value={apiUser?.email || user?.email || "-"}
        />

        <PersonalInfoCard
          icon={Phone}
          label={t("settings.phone")}
          value={
            [
              apiUser?.countryCode || user?.countryCode,
              apiUser?.phone || user?.phone,
            ]
              .filter(Boolean)
              .join(" ") || "-"
          }
        />

        <PersonalInfoCard
          label={t("settings.dateOfBirth")}
          value={form.dob || "-"}
        />

        <PersonalInfoCard
          label={t("settings.gender")}
          value={form.gender || "-"}
        />
      </div>
    </div>
  );
}
