"use client";
import { Phone } from "lucide-react";
import Input from "./Input";
import { getPhoneInputProps } from "@dragorbit/core/phone";

// Reusable 10-digit phone input
const PhoneInput = ({
	value,
	onChange,
	label,
	placeholder,
	error,
	errorMessage,
	required = false,
	leftIcon = Phone,
	size = "sm",
	disabled = false,
	name,
	id,
	className = "",
	helperText,
	...props
}) => {
	return (
		<Input
			{...getPhoneInputProps({ value, onChange })}
			label={label}
			placeholder={placeholder}
			error={error}
			errorMessage={errorMessage}
			required={required}
			leftIcon={leftIcon}
			size={size}
			disabled={disabled}
			name={name}
			id={id}
			className={className}
			helperText={helperText}
			{...props}
		/>
	);
};

export default PhoneInput;
