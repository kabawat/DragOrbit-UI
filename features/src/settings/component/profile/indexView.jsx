"use client";
import { Save, User } from "lucide-react";
export function ProfileSettingsView({ model }) {
  const {
    ProfilePictureSection,
    form,
    apiUser,
    user,
    PersonalInfoSection,
    handleOpenEdit,
    isEditing,
    AccountActionsSection,
    FormDrawer,
    handleCancel,
    handleSave,
    isSaving,
    ProfileEditForm,
    handleChange,
  } = model;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
          Profile Settings
        </h2>
        <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
          Manage your personal information and profile details
        </p>
      </div>

      {/* Profile Picture Section */}
      <ProfilePictureSection
        firstName={form.firstName}
        lastName={form.lastName}
        email={apiUser?.email || user?.email}
        phone={apiUser?.phone || user?.phone}
        countryCode={apiUser?.countryCode || user?.countryCode}
        profileImage={apiUser?.profile || user?.profile}
      />

      {/* Personal Information Section */}
      <PersonalInfoSection
        form={form}
        apiUser={apiUser}
        user={user}
        onEditClick={handleOpenEdit}
      />

      {/* Account Actions */}
      {!isEditing && <AccountActionsSection />}

      {/* Edit Drawer */}
      <FormDrawer
        isOpen={isEditing}
        onClose={handleCancel}
        title="Edit Profile"
        icon={User}
        description="Update your personal information"
        width="w-full md:w-2/3 lg:w-1/2"
        onSave={handleSave}
        onCancel={handleCancel}
        saveLabel={isSaving ? "Saving..." : "Save Changes"}
        cancelLabel="Cancel"
        isSaving={isSaving}
        saveIcon={Save}
        saveVariant="primary"
      >
        <ProfileEditForm form={form} onChange={handleChange} />
      </FormDrawer>
    </div>
  );
}
