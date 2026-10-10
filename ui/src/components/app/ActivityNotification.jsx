"use client";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
export function ActivityNotification({
	message,
	icon,
	onClick,
	onClose,
	resetKey,
	duration = 6000,
	title = "New Activity",
	detailLabel = "Tap to view details",
	timeLabel = "Just now",
	closeLabel = "Close notification",
}) {
	const [visible, setVisible] = useState(false);
	const timer = useRef(null);
	const exitTimer = useRef(null);
	const callbacks = useRef({ onClose, onClick });
	callbacks.current = { onClose, onClick };
	const stop = useCallback(() => {
		clearTimeout(timer.current);
	}, []);
	const close = useCallback(() => {
		stop();
		clearTimeout(exitTimer.current);
		setVisible(false);
		exitTimer.current = setTimeout(() => callbacks.current.onClose?.(), 300);
	}, [stop]);
	const start = useCallback(() => {
		stop();
		timer.current = setTimeout(close, duration);
	}, [close, duration, stop]);
	useEffect(() => {
		// A replacement activity restarts the display and dismissal timers.
		void resetKey;
		clearTimeout(exitTimer.current);
		setVisible(false);
		const appear = setTimeout(() => setVisible(true), 100);
		start();
		return () => {
			clearTimeout(appear);
			stop();
			clearTimeout(exitTimer.current);
		};
	}, [resetKey, start, stop]);
	return (
		<aside
			aria-live="polite"
			onMouseEnter={stop}
			onMouseLeave={start}
			onFocus={stop}
			onBlur={start}
			className={`fixed top-15 right-4 z-[10001] w-90 max-w-[calc(100vw-2rem)] transition-all duration-300 ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
		>
			<div className="relative overflow-hidden bg-[rgb(var(--color-bg-primary))]/90 backdrop-blur-xl shadow-sm border border-[rgb(var(--color-border-primary))]/50 rounded-xl">
				<button
					type="button"
					onClick={() => {
						callbacks.current.onClick?.();
						close();
					}}
					className="flex w-full text-left p-5 pr-10 items-start gap-4 hover:bg-[rgb(var(--color-bg-secondary))]"
				>
					{icon && (
						<span className="w-12 h-12 rounded-xl bg-[rgb(var(--color-bg-secondary))] flex items-center justify-center shrink-0">
							{icon}
						</span>
					)}
					<span className="min-w-0">
						<span className="block text-[0.625rem] font-bold text-[rgb(var(--color-primary))] uppercase tracking-wider">
							{title}
						</span>
						<span className="block text-sm font-semibold text-[rgb(var(--color-text-primary))] mt-1 break-words">
							{message}
						</span>
						<span className="block text-xs text-[rgb(var(--color-text-tertiary))] mt-2">
							{detailLabel} · {timeLabel}
						</span>
					</span>
				</button>
				<button
					type="button"
					onClick={close}
					aria-label={closeLabel}
					className="absolute top-2 right-2 p-1 rounded-lg hover:bg-[rgb(var(--color-bg-tertiary))]"
				>
					<X className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
				</button>
			</div>
		</aside>
	);
}
