import type { HTMLAttributes } from "react";
export function ModalHeader({
	className = "",
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			{...props}
			className={`px-4 py-3 border-b border-[rgb(var(--color-border-primary))] ${className}`}
		/>
	);
}
export function ModalBody({
	className = "",
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return <div {...props} className={`px-4 py-3 ${className}`} />;
}
export function ModalFooter({
	className = "",
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			{...props}
			className={`px-4 py-3 border-t border-[rgb(var(--color-border-primary))] flex justify-end gap-2 ${className}`}
		/>
	);
}
