"use client";
import { Download } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { Modal } from "../modal/Modal";
import { Button } from "../button/Button";
export type SlideDrawerProps = {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	title?: ReactNode;
	icon?: ComponentType<{ className?: string }>;
	description?: ReactNode;
	width?: string;
	showDownloadButton?: boolean;
	onDownload?: (() => void) | null;
	downloadLabel?: string;
	closeOnOutsideClick?: boolean;
	closeOnEscape?: boolean;
	draggable?: boolean;
	resizable?: boolean;
	autoHeight?: boolean;
	position?: "center" | "right";
	className?: string;
	closeLabel?: string;
};
export function SlideDrawer({
	isOpen,
	onClose,
	title,
	icon: Icon,
	description,
	children,
	width = "w-full md:w-2/3",
	showDownloadButton = false,
	onDownload,
	downloadLabel = "Download",
	closeOnOutsideClick = true,
	closeOnEscape = true,
	draggable = true,
	resizable = true,
	autoHeight = false,
	position = "right",
	className = "",
	closeLabel,
}: SlideDrawerProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			closeOnOverlayClick={closeOnOutsideClick}
			closeOnEscape={closeOnEscape}
			closeLabel={closeLabel}
			draggable={draggable}
			resizable={resizable}
			position={position}
			showCloseButton
			className={`dragorbit-slide-drawer ${width} ${className}`}
			style={{ height: autoHeight ? undefined : "calc(100dvh - 20px)" }}
			title={
				<span className="flex items-center gap-3">
					{Icon && (
						<Icon className="w-5 h-5 text-[rgb(var(--color-primary))]" />
					)}
					<span>
						{title}
						{description && (
							<small className="block text-xs text-[rgb(var(--color-text-secondary))]">
								{description}
							</small>
						)}
					</span>
				</span>
			}
			headerActions={
				showDownloadButton && onDownload ? (
					<Button onClick={onDownload} size="sm" leftIcon={Download}>
						{downloadLabel}
					</Button>
				) : undefined
			}
		>
			<div className="h-full min-h-0 flex flex-col">{children}</div>
		</Modal>
	);
}
export const SideDrawer = SlideDrawer;
