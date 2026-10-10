"use client";
import { Check } from "lucide-react";
import React from "react";

const StepProgress = ({
	formData = {},
	className = "",
	orientation = "horizontal", // 'horizontal' or 'vertical'
	showLabels = true,
	showIcons = true,
	size = "md", // 'sm', 'md', 'lg'
	...props
}) => {
	// Helper function to get nested values from object
	const getNestedValue = (obj, path) => {
		return path.split(".").reduce((current, key) => {
			return current && current[key] !== undefined ? current[key] : undefined;
		}, obj);
	};

	// Calculate step completion based on form data
	const calculateStepCompletion = (data) => {
		const defaultSteps = [
			{
				id: "basic",
				title: "Basic Information",
				description: "Product name, brand, and basic details",
				fields: [
					{ name: "name", value: data.name?.trim(), required: true },
					{ name: "brand", value: data.brand?.trim(), required: true },
					{
						name: "category",
						value:
							typeof data.category === "string"
								? data.category?.trim()
								: data.category?.name?.trim(),
						required: true,
					},
					{ name: "sku", value: data.sku?.trim(), required: false },
					{ name: "barcode", value: data.barcode?.trim(), required: false },
				],
			},
			{
				id: "media",
				title: "Media & Images",
				description: "Upload product images and videos",
				fields: [
					{
						name: "images",
						value:
							Array.isArray(data.images) && data.images.length > 0 ? "yes" : "",
						required: false,
					},
				],
			},
			{
				id: "pricing-gst",
				title: "Pricing & GST",
				description: "Set product prices, currency, HSN, and tax settings",
				fields: [
					{ name: "mrp", value: data.mrp, required: true, numeric: true },
					{
						name: "sellingPrice",
						value: data.sellingPrice,
						required: true,
						numeric: true,
					},
					{ name: "currency", value: data.currency, required: true },
					{ name: "uom", value: data.uom, required: true },
					{
						name: "hsnCode",
						value: data.gstInfo?.hsnCode?.trim(),
						required: false,
					},
				],
			},
			{
				id: "content",
				title: "Catalog information",
				description:
					"Content for your public catalog where customers can shop online",
				fields: [
					{
						name: "showInCatalog",
						value: data.showInCatalog !== false ? "yes" : "",
						required: false,
					},
					{
						name: "shortDescription",
						value: data.content?.shortDescription?.trim(),
						required: false,
					},
					{
						name: "features",
						value:
							Array.isArray(data.content?.features) &&
							data.content.features.length > 0
								? "yes"
								: "",
						required: false,
					},
					{
						name: "tags",
						value:
							Array.isArray(data.content?.tags) && data.content.tags.length > 0
								? "yes"
								: "",
						required: false,
					},
					{
						name: "specifications",
						value:
							Array.isArray(data.content?.specifications) &&
							data.content.specifications.length > 0
								? "yes"
								: "",
						required: false,
					},
				],
			},
		];

		// Calculate completion percentage for each step
		return defaultSteps.map((step) => {
			// Check if step has conditional logic
			if (step.conditional) {
				const conditionalValue = getNestedValue(data, step.conditional.field);
				if (conditionalValue !== step.conditional.value) {
					// If condition not met, return 0% completion
					return {
						...step,
						completed: false,
						completionPercentage: 0,
						completedFields: 0,
						totalFields: step.fields.length,
					};
				}
			}

			const totalFields = step.fields.length;
			let completedFields = 0;

			step.fields.forEach((field) => {
				if (field.numeric) {
					if (field.value && parseFloat(field.value) > 0) {
						completedFields++;
					}
				} else if (field.value?.toString().trim()) {
					completedFields++;
				}
			});

			const completionPercentage = Math.round(
				(completedFields / totalFields) * 100,
			);
			const isCompleted = completionPercentage === 100;

			return {
				...step,
				completed: isCompleted,
				completionPercentage,
				completedFields,
				totalFields,
			};
		});
	};

	// Calculate steps from formData
	const calculatedSteps = calculateStepCompletion(formData);

	// Get information level and colors based on completion percentage
	const getInformationLevel = (percentage) => {
		if (percentage === 0) return "not-provided";
		if (percentage < 20) return "low";
		if (percentage < 40) return "mid";
		if (percentage < 80) return "average";
		return "full";
	};

	const getInformationColors = (level) => {
		switch (level) {
			case "not-provided":
				return {
					text: "text-gray-500",
					bg: "bg-gray-400",
					border: "border-gray-400",
					shadow: "shadow-gray-400/30",
				};
			case "low":
				return {
					text: "text-red-600",
					bg: "bg-red-500",
					border: "border-red-500",
					shadow: "shadow-red-500/30",
				};
			case "mid":
				return {
					text: "text-orange-600",
					bg: "bg-orange-500",
					border: "border-orange-500",
					shadow: "shadow-orange-500/30",
				};
			case "average":
				return {
					text: "text-yellow-600",
					bg: "bg-yellow-500",
					border: "border-yellow-500",
					shadow: "shadow-yellow-500/30",
				};
			case "full":
				return {
					text: "text-emerald-600",
					bg: "bg-emerald-500",
					border: "border-emerald-500",
					shadow: "shadow-emerald-500/30",
				};
			default:
				return {
					text: "text-gray-500",
					bg: "bg-gray-300",
					border: "border-gray-300",
					shadow: "shadow-gray-300/30",
				};
		}
	};

	const getStepStatus = (stepIndex) => {
		if (calculatedSteps[stepIndex]?.completed) return "completed";
		return "upcoming";
	};

	const getStepIcon = (_stepIndex, status) => {
		if (!showIcons) return null;

		if (status === "completed") {
			return (
				<div className="relative">
					<Check
						className="w-3 h-3 text-white drop-shadow-sm"
						strokeWidth={3}
					/>
					<div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
				</div>
			);
		}
		return (
			<div className="w-2 h-2 bg-[rgb(var(--color-text-tertiary))] rounded-full"></div>
		);
	};

	const getStepClasses = (status, size, step) => {
		const baseClasses =
			"flex items-center justify-center rounded-full border-2 transition-all duration-500 shadow-lg backdrop-blur-sm";
		const sizeClasses = {
			sm: "w-7 h-7",
			md: "w-9 h-9",
			lg: "w-11 h-11",
		};

		if (status === "completed") {
			return `${baseClasses} ${sizeClasses[size]} bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500 shadow-emerald-500/30`;
		}

		// Use information level colors for incomplete steps
		const infoLevel = getInformationLevel(step.completionPercentage);
		const colors = getInformationColors(infoLevel);

		return `${baseClasses} ${sizeClasses[size]} bg-gradient-to-br ${colors.bg} border-${colors.border.split("-")[1]}-500 ${colors.shadow}`;
	};

	const getLabelClasses = (status) => {
		const baseClasses = "text-xs font-bold transition-all duration-300";

		if (status === "completed") {
			return `${baseClasses} text-emerald-700 dark:text-emerald-400`;
		}
		return `${baseClasses} text-gray-500 dark:text-gray-400`;
	};

	if (orientation === "vertical") {
		return (
			<div className={`space-y-4 ${className}`} {...props}>
				{calculatedSteps.map((step, index) => {
					const status = getStepStatus(index);

					return (
						<div key={index} className="flex items-start space-x-4">
							{/* Step Icon */}
							<div className="flex flex-col items-center">
								<div className={getStepClasses(status, size, step)}>
									{getStepIcon(index, status)}
								</div>
							</div>

							{/* Step Content */}
							<div className="flex-1 pb-4">
								{showLabels && (
									<div className="space-y-1">
										<h4 className={getLabelClasses(status)}>{step.title}</h4>
										{step.description && (
											<p className="text-sm text-[rgb(var(--color-text-secondary))]">
												{step.description}
											</p>
										)}
										<div className="mt-2 flex items-center space-x-2">
											<span className="text-xs text-[rgb(var(--color-text-tertiary))] whitespace-nowrap">
												{step.completedFields}/{step.totalFields}
											</span>
											<div className="flex-1 bg-gray-200 rounded-full h-1.5">
												<div
													className={`h-1.5 rounded-full transition-all duration-500 ${
														step.completionPercentage === 100
															? "bg-emerald-500"
															: getInformationColors(
																	getInformationLevel(
																		step.completionPercentage,
																	),
																).bg
													}`}
													style={{ width: `${step.completionPercentage}%` }}
												></div>
											</div>
											<span
												className={`text-xs font-semibold whitespace-nowrap ${
													step.completionPercentage === 100
														? "text-emerald-600"
														: getInformationColors(
																getInformationLevel(step.completionPercentage),
															).text
												}`}
											>
												{step.completionPercentage}%
											</span>
										</div>
										{step.details && (
											<div className="text-xs text-[rgb(var(--color-text-tertiary))] space-y-1">
												{step.details.map((detail, detailIndex) => (
													<div
														key={detailIndex}
														className="flex items-center space-x-2"
													>
														<div
															className={`w-1 h-1 rounded-full ${
																detail.completed
																	? "bg-[rgb(var(--color-primary))]"
																	: "bg-[rgb(var(--color-border-primary))]"
															}`}
														/>
														<span
															className={
																detail.completed
																	? "text-[rgb(var(--color-text-primary))]"
																	: "text-[rgb(var(--color-text-tertiary))]"
															}
														>
															{detail.label}
														</span>
													</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	// Horizontal orientation
	return (
		<div
			className={`flex items-center justify-between ${className}`}
			{...props}
		>
			{calculatedSteps.map((step, index) => {
				const status = getStepStatus(index);

				return (
					<React.Fragment key={index}>
						{/* Step */}
						<div className="flex items-center justify-between space-x-3">
							{/* Step Icon */}
							<div
								className={`${getStepClasses(status, size, step)} flex-shrink-0`}
							>
								{getStepIcon(index, status)}
							</div>

							{/* Step Label */}
							{showLabels && (
								<div className="text-left min-w-0 flex-1">
									<h4 className={getLabelClasses(status)}>{step.title}</h4>
									{step.description && (
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight whitespace-nowrap">
											{step.description}
										</p>
									)}
									<div className="mt-1 flex items-center space-x-2">
										<span className="text-xs text-gray-400 whitespace-nowrap">
											{step.completedFields}/{step.totalFields}
										</span>
										<div className="flex-1 bg-gray-200 rounded-full h-1">
											<div
												className={`h-1 rounded-full transition-all duration-500 ${
													step.completionPercentage === 100
														? "bg-emerald-500"
														: getInformationColors(
																getInformationLevel(step.completionPercentage),
															).bg
												}`}
												style={{ width: `${step.completionPercentage}%` }}
											></div>
										</div>
										<span
											className={`text-xs font-semibold whitespace-nowrap ${
												step.completionPercentage === 100
													? "text-emerald-600"
													: getInformationColors(
															getInformationLevel(step.completionPercentage),
														).text
											}`}
										>
											{step.completionPercentage}%
										</span>
									</div>
								</div>
							)}
						</div>
					</React.Fragment>
				);
			})}
		</div>
	);
};

export default StepProgress;
