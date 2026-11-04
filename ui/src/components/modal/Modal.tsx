"use client";
import { X } from "lucide-react";
import {
	type CSSProperties,
	type PointerEvent,
	type ReactNode,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { Tooltip as SharedTooltip } from "../tooltip/Tooltip";
import "./modal.css";
const modalStack: HTMLDivElement[] = [];
// Legacy dialogs use 9999. Shared dialogs sit above them, in opening order.
let nextModalLayer = 10000;
let previousBodyOverflow = "";
export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	labelledBy?: string;
	ariaLabel?: string;
	closeOnOverlayClick?: boolean;
	closeOnEscape?: boolean;
	showCloseButton?: boolean;
	closeLabel?: string;
	className?: string;
	/** Opt-in padding for content; existing self-padded dialogs remain unchanged. */
	bodyClassName?: string;
	footer?: ReactNode;
	size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
	overlayClassName?: string;
	title?: ReactNode;
	headerActions?: ReactNode;
	draggable?: boolean;
	resizable?: boolean;
	position?: "center" | "right";
	style?: CSSProperties;
}
export function Modal({
	isOpen,
	onClose,
	children,
	labelledBy,
	className = "",
	bodyClassName = "",
	footer,
	size,
	overlayClassName = "",
	title,
	headerActions,
	draggable = false,
	resizable = false,
	position = "center",
	style,
	ariaLabel = "Dialog",
	closeOnOverlayClick = true,
	closeOnEscape = true,
	showCloseButton = Boolean(title),
	closeLabel = "Close dialog",
}: ModalProps) {
	const generatedId = useId();
	const titleId = labelledBy ?? (title ? generatedId : undefined);
	const escapeEnabled = useRef(closeOnEscape);
	escapeEnabled.current = closeOnEscape;
	const [present, setPresent] = useState(false);
	const [visible, setVisible] = useState(false);
	const panel = useRef<HTMLDivElement>(null);
	const close = useRef(onClose);
	const [bounds, setBounds] = useState<{
		left: number;
		top: number;
		width: number;
		height: number;
	} | null>(null);
	const gesture = useRef<{
		x: number;
		y: number;
		left: number;
		top: number;
		width: number;
		height: number;
		mode: "drag" | "width" | "height";
	} | null>(null);
	const begin = (
		event: PointerEvent<HTMLElement>,
		mode: "drag" | "width" | "height",
	) => {
		if (
			event.button !== 0 ||
			(mode === "drag" &&
				(event.target as HTMLElement).closest(
					"button, a, input, select, textarea",
				))
		)
			return;
		const rect = panel.current?.getBoundingClientRect();
		if (!rect) return;
		event.preventDefault();
		event.currentTarget.setPointerCapture(event.pointerId);
		gesture.current = {
			x: event.clientX,
			y: event.clientY,
			left: rect.left,
			top: rect.top,
			width: rect.width,
			height: rect.height,
			mode,
		};
		setBounds({
			left: rect.left,
			top: rect.top,
			width: rect.width,
			height: rect.height,
		});
	};
	const move = (event: PointerEvent<HTMLElement>) => {
		const start = gesture.current;
		if (!start) return;
		const dx = event.clientX - start.x,
			dy = event.clientY - start.y;
		const maxWidth = window.innerWidth - 20,
			maxHeight = window.innerHeight - 20;
		if (start.mode === "drag") {
			setBounds({
				width: start.width,
				height: start.height,
				left: Math.max(
					10,
					Math.min(window.innerWidth - start.width - 10, start.left + dx),
				),
				top: Math.max(
					10,
					Math.min(window.innerHeight - start.height - 10, start.top + dy),
				),
			});
		} else if (start.mode === "width") {
			const right = start.left + start.width;
			const width = Math.max(
				Math.min(320, maxWidth),
				Math.min(right - 10, start.width - dx),
			);
			setBounds({
				left: right - width,
				top: start.top,
				width,
				height: start.height,
			});
		} else {
			const height = Math.max(
				Math.min(220, maxHeight),
				Math.min(window.innerHeight - start.top - 10, start.height + dy),
			);
			setBounds({
				left: start.left,
				top: start.top,
				width: start.width,
				height,
			});
		}
	};
	const end = () => {
		gesture.current = null;
	};
	useEffect(() => {
		const resize = () =>
			setBounds((current) => {
				if (!current) return current;
				const width = Math.min(current.width, window.innerWidth - 20),
					height = Math.min(current.height, window.innerHeight - 20);
				return {
					width,
					height,
					left: Math.max(
						10,
						Math.min(current.left, window.innerWidth - width - 10),
					),
					top: Math.max(
						10,
						Math.min(current.top, window.innerHeight - height - 10),
					),
				};
			});
		window.addEventListener("resize", resize);
		return () => window.removeEventListener("resize", resize);
	}, []);
	useEffect(() => {
		close.current = onClose;
	}, [onClose]);
	useEffect(() => {
		if (isOpen) {
			setPresent(true);
			const frame = requestAnimationFrame(() => {
				setBounds(null);
				setVisible(true);
			});
			return () => cancelAnimationFrame(frame);
		}
		setVisible(false);
		const timer = setTimeout(() => setPresent(false), 220);
		return () => clearTimeout(timer);
	}, [isOpen]);
	useEffect(() => {
		if (!present) return;
		const previous = document.activeElement as HTMLElement | null;
		const element = panel.current;
		if (!element) return;
		if (!modalStack.length) previousBodyOverflow = document.body.style.overflow;
		modalStack.push(element);
		const overlay = element.parentElement;
		if (overlay) overlay.style.zIndex = String(nextModalLayer++);
		document.body.style.overflow = "hidden";
		element.focus();
		const keydown = (event: KeyboardEvent) => {
			if (modalStack[modalStack.length - 1] !== element) return;
			if (
				event.key === "Escape" &&
				!event.defaultPrevented &&
				escapeEnabled.current
			) {
				event.preventDefault();
				close.current();
			}
			if (event.key !== "Tab") return;
			const nodes = Array.from(
				panel.current?.querySelectorAll<HTMLElement>(
					'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
				) || [],
			)
				.concat(
					Array.from(
						document.querySelectorAll<HTMLElement>(
							`[data-dragorbit-dialog-owner="${generatedId}"] button:not(:disabled), [data-dragorbit-dialog-owner="${generatedId}"] input:not(:disabled), [data-dragorbit-dialog-owner="${generatedId}"] [tabindex="0"]`,
						),
					),
				)
				.filter((node) => node.getClientRects().length);
			const first = nodes[0],
				last = nodes[nodes.length - 1];
			if (!first) {
				event.preventDefault();
				return;
			}
			if (
				event.shiftKey &&
				(document.activeElement === first ||
					document.activeElement === panel.current)
			) {
				event.preventDefault();
				last.focus();
			} else if (
				!event.shiftKey &&
				(document.activeElement === last ||
					document.activeElement === panel.current)
			) {
				event.preventDefault();
				first.focus();
			}
		};
		document.addEventListener("keydown", keydown);
		return () => {
			const wasTop = modalStack[modalStack.length - 1] === element;
			const index = modalStack.indexOf(element);
			if (index >= 0) modalStack.splice(index, 1);
			if (!modalStack.length) {
				document.body.style.overflow = previousBodyOverflow;
				nextModalLayer = 10000;
			}
			document.removeEventListener("keydown", keydown);
			if (wasTop) {
				const top = modalStack[modalStack.length - 1];
				if (top) top.focus();
				else if (previous?.isConnected) previous.focus();
			}
		};
	}, [present, generatedId]);
	if (!present) return null;
	const handlers = {
		onPointerMove: move,
		onPointerUp: end,
		onPointerCancel: end,
		onLostPointerCapture: end,
	};
	return createPortal(
		// biome-ignore lint/a11y/noStaticElementInteractions: decorative backdrop; keyboard dismissal and focus are managed by the dialog.
		<div
			role="presentation"
			className={`dragorbit-modal-overlay ${overlayClassName}`}
			data-position={position}
			data-open={visible}
			onClick={(event) => {
				if (
					closeOnOverlayClick &&
					event.target === event.currentTarget &&
					modalStack[modalStack.length - 1] === panel.current
				)
					close.current();
			}}
		>
			<div
				ref={panel}
				id={generatedId}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-label={titleId ? undefined : ariaLabel}
				tabIndex={-1}
				className={`dragorbit-modal-panel dragorbit-modal-window ${className}`}
				style={{
					...(size
						? {
								width: "100%",
								maxWidth: {
									sm: "24rem",
									md: "32rem",
									lg: "40rem",
									xl: "48rem",
									"2xl": "56rem",
									"3xl": "64rem",
									full: "100%",
								}[size],
							}
						: {}),
					...style,
					...(bounds
						? {
								position: "fixed",
								left: bounds.left,
								top: bounds.top,
								width: bounds.width,
								maxWidth: "calc(100vw - 20px)",
								height: bounds.height,
							}
						: {}),
				}}
			>
				{(title || showCloseButton) && (
					<header
						className={`dragorbit-modal-header ${draggable ? "is-draggable" : ""}`}
						onPointerDown={
							draggable ? (event) => begin(event, "drag") : undefined
						}
						{...handlers}
					>
						<h2 id={titleId}>{title}</h2>
						<div className="dragorbit-modal-header-actions">
							{headerActions}
							{showCloseButton && (
								<button type="button" onClick={onClose} aria-label={closeLabel}>
									<X size={20} />
								</button>
							)}
						</div>
					</header>
				)}
				{title || showCloseButton || bodyClassName ? (
					<div className={`dragorbit-modal-content ${bodyClassName}`}>
						{children}
					</div>
				) : (
					children
				)}
				{footer && <div className="dragorbit-modal-footer">{footer}</div>}
				{resizable && (
					<>
						<SharedTooltip content={"Drag to resize width"}><div
							className="dragorbit-resize-width"

							onPointerDown={(event) => begin(event, "width")}
							{...handlers}
						/></SharedTooltip>
						<SharedTooltip content={"Drag to resize height"}><div
							className="dragorbit-resize-height"

							onPointerDown={(event) => begin(event, "height")}
							{...handlers}
						/></SharedTooltip>
					</>
				)}
			</div>
		</div>,
		document.body,
	);
}
