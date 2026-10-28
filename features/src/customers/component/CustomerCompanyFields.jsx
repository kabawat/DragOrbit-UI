"use client";
import { Button, Input, Tooltip as SharedTooltip } from "@dragorbit/ui";
import {
	Building2,
	CheckCircle,
	FileText,
	Plus,
	ShieldCheck,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

const CompanyDetails = ({
	formData,
	onChange,
	fieldErrors,
	gstVerification,
	t,
}) => {
	const [showSection, setShowSection] = useState(false);

	// Sync visibility with data (especially useful for Edit mode)
	useEffect(() => {
		if (
			formData.companyDetails &&
			(formData.companyDetails.companyName ||
				formData.companyDetails.gstin ||
				formData.companyDetails.gstDetail)
		) {
			setShowSection(true);
		}
	}, [formData.companyDetails]);

	const {
		isVerifyingGst = false,
		handleVerifyGst = () => {},
		isGstVerified = false,
	} = gstVerification || {};

	const handleCompanyChange = (fieldName, value) => {
		onChange("companyDetails", {
			...(formData.companyDetails || {}),
			[fieldName]: value,
		});
	};

	const onAdd = () => {
		setShowSection(true);
		// Optional: Initialize with empty object if needed
		if (!formData.companyDetails) {
			onChange("companyDetails", { gstin: "", companyName: "", gstDetail: "" });
		}
	};

	const onRemove = () => {
		setShowSection(false);
		onChange("companyDetails", null);
	};

	return (
		<div className="bg-[rgb(var(--color-bg-primary))]/20 backdrop-blur-md rounded-lg border border-[rgb(var(--color-border-primary))]/50 p-4 sm:p-6">
			<div className="flex items-center space-x-3 mb-6">
				<div className="w-10 h-10 bg-[rgb(var(--color-primary))]/10 rounded-lg flex items-center justify-center">
					<Building2 className="w-5 h-5 text-[rgb(var(--color-primary))]" />
				</div>
				<div className="flex-1">
					<h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">
						{t("customers.companyDetails")}
					</h2>
					<p className="text-sm text-[rgb(var(--color-text-secondary))]">
						{t("customers.enterCompanyInfo")}
					</p>
				</div>
				{showSection && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onRemove}
						className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 h-auto"
						title={t("common.remove")}
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				)}
			</div>

			<div className="space-y-6">
				{!showSection && (
					<div className="flex flex-wrap gap-3">
						<Button variant="outline" size="sm" onClick={onAdd} leftIcon={Plus}>
							{t("customers.addCompanyDetails")}
						</Button>
					</div>
				)}

				{showSection && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
						{/* Company Name */}
						<Input
							type="text"
							label={t("customers.companyName")}
							placeholder={t("customers.enterCompanyName")}
							value={formData.companyDetails?.companyName || ""}
							onChange={(value) => handleCompanyChange("companyName", value)}
							error={!!fieldErrors["companyDetails.companyName"]}
							errorMessage={fieldErrors["companyDetails.companyName"]}
							leftIcon={Building2}
							size="sm"
						/>

						{/* GSTIN */}
						<Input
							type="text"
							label={t("customers.gstin")}
							placeholder={t("customers.enterGstin")}
							value={formData.companyDetails?.gstin || ""}
							onChange={(value) => {
								handleCompanyChange("gstin", value.toUpperCase());
								if (formData.companyDetails?.gstDetail) {
									handleCompanyChange("gstDetail", "");
								}
							}}
							onBlur={() => {
								if (
									formData.companyDetails?.gstin?.length === 15 &&
									!isGstVerified &&
									!isVerifyingGst
								) {
									handleVerifyGst(formData.companyDetails?.gstin);
								}
							}}
							error={!!fieldErrors["companyDetails.gstin"]}
							errorMessage={fieldErrors["companyDetails.gstin"]}
							leftIcon={FileText}
							size="sm"
							rightElement={
								formData.companyDetails?.gstin?.length >= 15 && (
									<SharedTooltip content={isGstVerified ? "Verified" : "Verify GST"}><button
										type="button"
										onMouseDown={(event) => event.preventDefault()}
										onClick={() =>
											handleVerifyGst(formData.companyDetails?.gstin)
										}
										disabled={isVerifyingGst || isGstVerified}
										className={`p-1.5 rounded-md transition-all disabled:opacity-70 ${
											isGstVerified
												? "bg-green-500 text-white shadow-sm"
												: "bg-[rgb(var(--color-primary))] text-white hover:brightness-110"
										}`}

									>
										{isVerifyingGst ? (
											<div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										) : isGstVerified ? (
											<CheckCircle className="w-3.5 h-3.5" />
										) : (
											<ShieldCheck className="w-3.5 h-3.5" />
										)}
									</button></SharedTooltip>
								)
							}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default CompanyDetails;
