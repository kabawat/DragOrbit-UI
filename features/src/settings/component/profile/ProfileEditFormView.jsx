"use client";
import { User } from "lucide-react";
import { Input, Select } from "@dragorbit/ui";
export function ProfileEditFormView({ model }) {
  const { form, handleInputChange, genderOptions } = model;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* First Name */}
      <Input
        label="First Name"
        name="firstName"
        type="text"
        value={form.firstName || ""}
        onChange={(value) => handleInputChange("firstName", value)}
        placeholder="Enter your first name"
        leftIcon={User}
        size="md"
      />

      {/* Last Name */}
      <Input
        label="Last Name"
        name="lastName"
        type="text"
        value={form.lastName || ""}
        onChange={(value) => handleInputChange("lastName", value)}
        placeholder="Enter your last name"
        leftIcon={User}
        size="md"
      />

      {/* Date of Birth */}
      <Input
        label="Date of Birth"
        name="dob"
        type="date"
        value={form.dob || ""}
        onChange={(value) => handleInputChange("dob", value)}
        size="md"
      />

      {/* Gender */}
      <Select
        label="Gender"
        name="gender"
        value={form.gender || ""}
        onChange={(value) => handleInputChange("gender", value)}
        options={genderOptions}
        placeholder="Select gender"
        size="md"
        searchable={true}
      />
    </div>
  );
}
