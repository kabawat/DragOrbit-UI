"use client";
import { useCallback } from "react";
import BasicInfo from "./CustomerBasicInfoFields.jsx";
import CompanyDetails from "./CustomerCompanyFields.jsx";
import AddressSection from "./CustomerAddressFields.jsx";

const CustomerForm = ({
	formData,
	onChange,
	fieldErrors = {},
	gstVerification = {},
	t,
}) => {
	const handleInputChange = useCallback(
		(fieldName, value) => {
			onChange(fieldName, value);
		},
		[onChange],
	);

	return (
		<div className="space-y-4 sm:space-y-6">
			<BasicInfo
				formData={formData}
				onChange={handleInputChange}
				fieldErrors={fieldErrors}
				t={t}
			/>

			<CompanyDetails
				formData={formData}
				onChange={handleInputChange}
				fieldErrors={fieldErrors}
				gstVerification={gstVerification}
				t={t}
			/>

			<AddressSection
				formData={formData}
				onChange={handleInputChange}
				fieldErrors={fieldErrors}
				t={t}
			/>
		</div>
	);
};

export default CustomerForm;
