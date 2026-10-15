"use client";
import type { HTMLAttributes } from "react";
import "./paper-document.css";
/** Documents retain their print palette independently of the surrounding app. */
export function PaperDocument({
	className = "",
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			{...props}
			data-paper-document
			className={`dragorbit-paper-document ${className}`}
		/>
	);
}
