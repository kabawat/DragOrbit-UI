function attachQueryParams(baseUrl, params = {}) {
	if (!baseUrl) {
		return "";
	}

	if (
		!params ||
		typeof params !== "object" ||
		Object.keys(params).length === 0
	) {
		return baseUrl;
	}

	const queryParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value === null || value === undefined || value === "") {
			return;
		}

		if (Array.isArray(value)) {
			value.forEach((item) => {
				queryParams.append(key, item);
			});
		} else {
			queryParams.append(key, String(value));
		}
	});

	const queryString = queryParams.toString();
	if (!queryString) {
		return baseUrl;
	}

	const separator = baseUrl.includes("?") ? "&" : "?";
	return `${baseUrl}${separator}${queryString}`;
}

function normalizeMessage(
	message,
	fallback = "Operation completed successfully.",
) {
	if (typeof message === "string") {
		const trimmed = message.trim();
		return trimmed || fallback;
	}
	if (message == null) return fallback;
	if (typeof message === "object" && typeof message.message === "string") {
		return normalizeMessage(message.message, fallback);
	}
	return fallback;
}

function formatErrorWithFields(message, fields) {
	const base = normalizeMessage(message, "An unexpected error occurred.");
	if (!fields || typeof fields !== "object") return base;

	const details = [
		...new Set(
			Object.values(fields).filter(
				(value) => typeof value === "string" && value.trim(),
			),
		),
	];

	if (!details.length) return base;
	return `${base}: ${details.join("; ")}`;
}

function handleSuccess(response) {
	const body = response?.data ?? response;
	if (
		response?.success === false ||
		response?.status === false ||
		(response?.success !== true &&
			response?.status !== true &&
			(body?.success === false || body?.status === false))
	) {
		const failure =
			response?.success === false || response?.status === false
				? response
				: body;
		const error = new Error(
			normalizeMessage(failure?.message, "Request failed."),
		);
		error.response = {
			status: failure?.statusCode ?? response?.status ?? null,
			data:
				failure?.error && typeof failure.error === "object"
					? {
							...failure.error,
							message: failure.message,
							fields: failure.error.fields || failure.fields,
						}
					: failure,
		};
		throw error;
	}
	const data = body && Object.hasOwn(body, "data") ? body.data : body;
	return {
		success: true,
		data,
		message: normalizeMessage(body?.message || response?.message),
		pagination: body?.pagination || response?.pagination || null,
	};
}

function handleError(error) {
	if (error?.response?.data) {
		const responseData = error.response.data;
		const message = normalizeMessage(
			responseData.message || responseData.error,
			"An unexpected error occurred.",
		);
		const fields = responseData.fields || null;
		return {
			success: false,
			message,
			displayMessage: formatErrorWithFields(message, fields),
			code: responseData.code || "UNKNOWN_ERROR",
			fields,
			status: error.response.status,
		};
	}

	const message = normalizeMessage(
		error?.message,
		"Network error occurred. Please try again later.",
	);
	const fields =
		error?.fields && typeof error.fields === "object" ? error.fields : null;
	return {
		success: false,
		message,
		displayMessage: formatErrorWithFields(message, fields),
		code: "NETWORK_ERROR",
		fields,
		status: null,
	};
}

function toApiError(error) {
	const result = handleError(error);
	const err = new Error(
		result.displayMessage || result.message || "Request failed",
	);
	err.fields = result.fields;
	throw err;
}

class HttpService {
	constructor({ authAxios, unauthAxios, uploadAxios }) {
		this.authAxios = authAxios;
		this.unauthAxios = unauthAxios;
		this.uploadAxios = uploadAxios;
	}

	buildUrl(endpoint, params = {}) {
		return attachQueryParams(endpoint, params);
	}

	// Auth methods
	async get(url, params = {}) {
		return this.authAxios.get(this.buildUrl(url, params));
	}

	async post(url, data = {}, params = {}) {
		return this.authAxios.post(this.buildUrl(url, params), data);
	}

	async put(url, data = {}, params = {}) {
		return this.authAxios.put(this.buildUrl(url, params), data);
	}

	async patch(url, data = {}, params = {}) {
		return this.authAxios.patch(this.buildUrl(url, params), data);
	}

	async delete(url, params = {}) {
		return this.authAxios.delete(this.buildUrl(url, params));
	}

	// Helper
	buildResourceUrl(resourceEndpoint, resourceId, storeId = null) {
		const url = resourceId
			? `${resourceEndpoint}/${resourceId}`
			: resourceEndpoint;
		return storeId ? this.buildUrl(url, { store: storeId }) : url;
	}
}

export {
	attachQueryParams,
	HttpService,
	normalizeMessage,
	handleSuccess,
	handleError,
	formatErrorWithFields,
	toApiError,
};
