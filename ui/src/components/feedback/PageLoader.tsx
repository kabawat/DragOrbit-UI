"use client";
import type { ReactNode } from "react";
import { TableSkeleton } from "./TableSkeleton";

/** Compatibility entry point: data loading uses the shared skeleton everywhere. */
export function PageLoader({
	text = "Loading…",
	className = "",
}: {
	text?: ReactNode;
	className?: string;
}) {
	return <TableSkeleton label={text} className={className} />;
}
