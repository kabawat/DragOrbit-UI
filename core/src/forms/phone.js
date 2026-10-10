export const PHONE_MAX_DIGITS = 10;
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

const DEFAULT_MESSAGES = {
	required: "Phone number is required",
	maxDigits: "Phone number cannot exceed 10 digits",
	invalid: "Please enter a valid 10-digit phone number",
	eitherRequired: "Either Phone or Email is required",
};

// Digits only, max 10
export function sanitizePhoneInput(value) {
	return String(value ?? "")
		.replace(/\D/g, "")
		.slice(0, PHONE_MAX_DIGITS);
}

function resolveMessage(t, key, fallback) {
	if (typeof t !== "function") return fallback;
	return t(key) || fallback;
}

// 10-digit Indian mobile (starts with 6-9)
export function validatePhone(phone, required = false, t) {
	if (!phone || !String(phone).trim()) {
		return {
			isValid: !required,
			error: required
				? resolveMessage(t, "validation.required", DEFAULT_MESSAGES.required)
				: null,
			cleaned: null,
		};
	}

	const cleaned = sanitizePhoneInput(phone);

	if (String(phone).replace(/\D/g, "").length > PHONE_MAX_DIGITS) {
		return {
			isValid: false,
			error: resolveMessage(
				t,
				"validation.phoneMaxDigits",
				DEFAULT_MESSAGES.maxDigits,
			),
			cleaned: null,
		};
	}

	if (
		cleaned.length !== PHONE_MAX_DIGITS ||
		!INDIAN_MOBILE_REGEX.test(cleaned)
	) {
		return {
			isValid: false,
			error: resolveMessage(
				t,
				"validation.invalidPhone",
				DEFAULT_MESSAGES.invalid,
			),
			cleaned: null,
		};
	}

	return { isValid: true, error: null, cleaned };
}

// Phone or email required; validate phone if present
export function validatePhoneOrEmailContact({ phone, email, t } = {}) {
	const errors = {};
	const phoneValue = typeof phone === "string" ? phone.trim() : "";
	const emailValue = typeof email === "string" ? email.trim() : "";

	if (!phoneValue && !emailValue) {
		const msg = resolveMessage(
			t,
			"validation.eitherPhoneOrEmailRequired",
			DEFAULT_MESSAGES.eitherRequired,
		);
		errors.phone = msg;
		errors.email = msg;
		return errors;
	}

	if (phoneValue) {
		const result = validatePhone(phoneValue, false, t);
		if (!result.isValid) {
			errors.phone = result.error;
		}
	}

	return errors;
}

// Shared props for phone Input fields
export function getPhoneInputProps({ value, onChange, ...rest } = {}) {
	return {
		type: "tel",
		inputMode: "numeric",
		autoComplete: "tel",
		maxLength: PHONE_MAX_DIGITS,
		value: value || "",
		onChange: (next) => onChange?.(sanitizePhoneInput(next)),
		...rest,
	};
}
