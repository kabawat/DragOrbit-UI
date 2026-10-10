"use client";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";

const identity = (value) => value;
const ToastContext = createContext(null);
export function useGlobalToast() {
	const value = useContext(ToastContext);
	if (!value) throw new Error("useGlobalToast requires ToastProvider");
	return value;
}
export function ToastProvider({
	children,
	shouldShowError,
	normalizeMessage = identity,
}) {
	const [toasts, setToasts] = useState([]);
	const sequence = useRef(0);
	const prefix = useId();
	const timers = useRef(new Map());
	const removeToast = useCallback((id) => {
		clearTimeout(timers.current.get(id));
		timers.current.delete(id);
		setToasts((value) => value.filter((toast) => toast.id !== id));
	}, []);
	useEffect(
		() => () => {
			for (const timer of timers.current.values()) clearTimeout(timer);
			timers.current.clear();
		},
		[],
	);
	const showToast = useCallback(
		(message, type = "error", duration = 5000, position = "bottom-center") => {
			const id = `${prefix}-${++sequence.current}`;
			setToasts((value) => [
				...value,
				{ id, message: normalizeMessage(message), type, duration, position },
			]);
			timers.current.set(
				id,
				setTimeout(() => removeToast(id), duration),
			);
			return id;
		},
		[normalizeMessage, prefix, removeToast],
	);
	const showError = useCallback(
		(message, duration = 5000) =>
			shouldShowError?.(message) === false
				? -1
				: showToast(message, "error", duration, "bottom-center"),
		[shouldShowError, showToast],
	);
	const showSuccess = useCallback(
		(message, duration = 3000) =>
			showToast(message, "success", duration, "top-right"),
		[showToast],
	);
	return (
		<ToastContext.Provider
			value={{ toasts, showToast, showError, showSuccess, removeToast }}
		>
			{children}
		</ToastContext.Provider>
	);
}
