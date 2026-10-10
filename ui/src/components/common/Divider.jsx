"use client";

const Divider = ({
	orientation = "horizontal",
	variant = "solid",
	thickness = "thin",
	color = "gray",
	className = "",
	children,
	...props
}) => {
	// Orientation classes
	const orientationClasses = {
		horizontal: "w-full",
		vertical: "h-full",
	};

	// Thickness classes
	const thicknessClasses = {
		thin: orientation === "horizontal" ? "h-px" : "w-px",
		medium: orientation === "horizontal" ? "h-0.5" : "w-0.5",
		thick: orientation === "horizontal" ? "h-1" : "w-1",
	};

	// Color classes
	const colorClasses = {
		gray: "bg-gray-200",
		blue: "bg-blue-200",
		green: "bg-green-200",
		red: "bg-red-200",
		yellow: "bg-yellow-200",
		purple: "bg-purple-200",
	};

	// Variant classes
	const variantClasses = {
		solid: "",
		dashed: "border-dashed border-t-0 border-l-0 border-r-0 border-b-2",
		dotted: "border-dotted border-t-0 border-l-0 border-r-0 border-b-2",
	};

	const dividerClasses = `${orientationClasses[orientation]} ${thicknessClasses[thickness]} ${colorClasses[color]} ${variantClasses[variant]} ${className}`;

	if (children) {
		return (
			<div
				className={`flex items-center ${orientation === "horizontal" ? "my-4" : "mx-4"}`}
				{...props}
			>
				<div className={dividerClasses} />
				<span
					className={`px-3 text-sm text-gray-500 ${orientation === "horizontal" ? "mx-2" : "my-2"}`}
				>
					{children}
				</span>
				<div className={dividerClasses} />
			</div>
		);
	}

	return <div className={dividerClasses} {...props} />;
};

export default Divider;
