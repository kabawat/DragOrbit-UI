"use client";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button, Input, Select } from "@dragorbit/ui";
import INDIAN_STATES from "../model/indianStates.js";

const AddressForm = ({
	type,
	addressData,
	onChange,
	onRemove,
	fieldErrors,
	t,
}) => {
	const label =
		type === "billing"
			? t("customers.billingAddress")
			: t("customers.shippingAddress");

	const handleFieldChange = (field, value) => {
		onChange(type, field, value);
	};

	return (
		<div className="border border-[rgb(var(--color-border-primary))]/30 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">
					{label}
				</h3>
				<Button
					variant="ghost"
					size="sm"
					onClick={onRemove}
					className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
				>
					<Trash2 className="w-4 h-4" />
				</Button>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Input
					type="text"
					label={t("customers.addressLine1")}
					placeholder={t("customers.enterAddressLine1")}
					value={addressData?.addressLine1 || ""}
					onChange={(value) => handleFieldChange("addressLine1", value)}
					error={!!fieldErrors[`addresses.${type}.addressLine1`]}
					errorMessage={fieldErrors[`addresses.${type}.addressLine1`]}
					className="md:col-span-2"
					size="sm"
				/>
				<Input
					type="text"
					label={t("customers.city")}
					placeholder={t("customers.enterCity")}
					value={addressData?.city || ""}
					onChange={(value) => handleFieldChange("city", value)}
					error={!!fieldErrors[`addresses.${type}.city`]}
					errorMessage={fieldErrors[`addresses.${type}.city`]}
					size="sm"
				/>
				<Select
					label={t("customers.state")}
					placeholder={t("customers.selectState")}
					options={INDIAN_STATES}
					value={addressData?.stateCode || ""}
					onChange={(value) => handleFieldChange("stateCode", value)}
					error={!!fieldErrors[`addresses.${type}.stateCode`]}
					errorMessage={fieldErrors[`addresses.${type}.stateCode`]}
					searchable
					clearable
					size="sm"
				/>
				<Input
					type="text"
					label={t("customers.pincode")}
					placeholder={t("customers.enterPincode")}
					value={addressData?.pincode || ""}
					onChange={(value) => handleFieldChange("pincode", value)}
					error={!!fieldErrors[`addresses.${type}.pincode`]}
					errorMessage={fieldErrors[`addresses.${type}.pincode`]}
					size="sm"
				/>
				<Input
					type="text"
					label={t("customers.country")}
					placeholder={t("customers.enterCountry")}
					value={addressData?.country || ""}
					onChange={(value) => handleFieldChange("country", value)}
					error={!!fieldErrors[`addresses.${type}.country`]}
					errorMessage={fieldErrors[`addresses.${type}.country`]}
					size="sm"
				/>
			</div>
		</div>
	);
};

const AddressSection = ({ formData, onChange, fieldErrors, t }) => {
	const [showBillingAddress, setShowBillingAddress] = useState(false);
	const [showShippingAddress, setShowShippingAddress] = useState(false);

	// Sync visibility with data
	useEffect(() => {
		if (formData.addresses) {
			if (formData.addresses.billing) setShowBillingAddress(true);
			if (formData.addresses.shipping) setShowShippingAddress(true);
		}
	}, [formData.addresses]);

	const handleAddressChange = (type, field, value) => {
		const errorKey = `addresses.${type}.${field}`;
		if (fieldErrors[errorKey]) {
			onChange("clearError", errorKey);
		}

		const currentAddresses = formData.addresses || {};
		onChange("addresses", {
			...currentAddresses,
			[type]: {
				...(currentAddresses[type] || {}),
				[field]: value,
			},
		});
	};

	const addAddress = (type) => {
		if (type === "billing") setShowBillingAddress(true);
		else setShowShippingAddress(true);

		const newAddress = {
			label:
				type === "billing"
					? t("customers.homeAddress")
					: t("customers.officeAddress"),
			addressLine1: "",
			city: "",
			state: "",
			pincode: "",
			country: "India",
			coordinates: {
				latitude: "0",
				longitude: "0",
			},
		};

		onChange("addresses", {
			...(formData.addresses || {}),
			[type]: newAddress,
		});
	};

	const removeAddress = (type) => {
		if (type === "billing") setShowBillingAddress(false);
		else setShowShippingAddress(false);

		const currentAddresses = { ...(formData.addresses || {}) };
		delete currentAddresses[type];

		onChange(
			"addresses",
			Object.keys(currentAddresses).length === 0 ? null : currentAddresses,
		);
	};

	return (
		<div className="bg-[rgb(var(--color-bg-primary))]/20 backdrop-blur-md rounded-lg border border-[rgb(var(--color-border-primary))]/50 p-4 sm:p-6">
			<div className="flex items-center space-x-3 mb-6">
				<div className="w-10 h-10 bg-[rgb(var(--color-primary))]/10 rounded-lg flex items-center justify-center">
					<MapPin className="w-5 h-5 text-[rgb(var(--color-primary))]" />
				</div>
				<div className="flex-1">
					<h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
						{t("customers.addresses")}
					</h2>
					<p className="text-sm text-[rgb(var(--color-text-secondary))]">
						{t("customers.addBillingShipping")}
					</p>
				</div>
			</div>

			<div className="space-y-6">
				<div className="flex flex-wrap gap-3">
					{!showBillingAddress && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => addAddress("billing")}
							leftIcon={Plus}
						>
							{t("customers.addBillingAddress")}
						</Button>
					)}
					{!showShippingAddress && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => addAddress("shipping")}
							leftIcon={Plus}
						>
							{t("customers.addShippingAddress")}
						</Button>
					)}
				</div>

				{showBillingAddress && (
					<AddressForm
						type="billing"
						addressData={formData.addresses?.billing}
						onChange={handleAddressChange}
						onRemove={() => removeAddress("billing")}
						fieldErrors={fieldErrors}
						t={t}
					/>
				)}

				{showShippingAddress && (
					<AddressForm
						type="shipping"
						addressData={formData.addresses?.shipping}
						onChange={handleAddressChange}
						onRemove={() => removeAddress("shipping")}
						fieldErrors={fieldErrors}
						t={t}
					/>
				)}
			</div>
		</div>
	);
};

export default AddressSection;
