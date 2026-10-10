"use client";
import { Mail, StickyNote, User } from "lucide-react";
import { Input, PhoneInput, Textarea } from "@dragorbit/ui";

const BasicInfo = ({ formData, onChange, fieldErrors, t }) => {
	return (
		<div className="bg-[rgb(var(--color-bg-primary))]/20 backdrop-blur-md rounded-lg border border-[rgb(var(--color-border-primary))]/50 p-4 sm:p-6">
			<div className="flex items-center space-x-3 mb-6">
				<div className="w-10 h-10 bg-[rgb(var(--color-primary))]/10 rounded-lg flex items-center justify-center">
					<User className="w-5 h-5 text-[rgb(var(--color-primary))]" />
				</div>
				<div>
					<h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
						{t("customers.customerInformation")}
					</h2>
					<p className="text-sm text-[rgb(var(--color-text-secondary))]">
						{t("customers.enterBasicDetails")}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				<Input
					type="text"
					label={t("customers.customerName")}
					placeholder={t("customers.enterCustomerName")}
					value={formData.name || ""}
					onChange={(value) => onChange("name", value)}
					error={!!fieldErrors.name}
					errorMessage={fieldErrors.name}
					required
					leftIcon={User}
					size="sm"
				/>

				<PhoneInput
					label={t("customers.customerPhone")}
					placeholder={t("customers.enterPhoneNumber")}
					value={formData.phone || ""}
					onChange={(value) => onChange("phone", value)}
					error={!!fieldErrors.phone}
					errorMessage={fieldErrors.phone}
				/>

				<Input
					type="email"
					label={t("customers.customerEmail")}
					placeholder={t("customers.enterEmailAddress")}
					value={formData.email || ""}
					onChange={(value) => onChange("email", value)}
					error={!!fieldErrors.email}
					errorMessage={fieldErrors.email}
					leftIcon={Mail}
					size="sm"
				/>
			</div>

			<div className="mt-4 sm:mt-6">
				<Textarea
					label={t("customers.note")}
					placeholder={t("customers.enterNote")}
					value={formData.note || ""}
					onChange={(value) => onChange("note", value)}
					error={!!fieldErrors.note}
					errorMessage={fieldErrors.note}
					leftIcon={StickyNote}
					rows={3}
					maxLength={1000}
					showCharCount
				/>
			</div>
		</div>
	);
};

export default BasicInfo;
