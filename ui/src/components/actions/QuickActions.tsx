"use client";
import type { ComponentType, ReactNode } from "react";
import { EditableGrid } from "../layout/EditableGrid";
import type { EditableGridProps } from "../layout/EditableGrid";
export type QuickActionData = {
	id: string;
	title: ReactNode;
	logo?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
	onClick?: () => void;
	onclick?: () => void;
	primary?: boolean;
	disabled?: boolean;
};
export function QuickAction({
	data,
	disabled = false,
}: {
	data: QuickActionData;
	disabled?: boolean;
}) {
	const Icon = data.logo;
	return (
		<button
			type="button"
			onClick={data.onClick ?? data.onclick}
			disabled={disabled || data.disabled}
			className={`group flex flex-col w-full h-full min-w-0 items-center justify-center gap-2 rounded-xl border px-2 py-4 text-center transition-colors focus-visible:outline-2 cursor-pointer focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--color-primary))] disabled:opacity-60 disabled:cursor-default border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-bg-tertiary))]"}`}
		>
			{Icon && <Icon className="h-6 w-6 shrink-0" aria-hidden />}
			<span className="w-full min-w-0 break-words text-sm font-medium">
				{data.title}
			</span>
		</button>
	);
}
export type QuickActionsProps = Omit<
	EditableGridProps<QuickActionData>,
	"renderItem"
>;
export function QuickActions(props: QuickActionsProps) {
	return (
		<EditableGrid
			{...props}
			maxCol={2}
			minCol={2}
			layout={{ ...props.layout, columns: 2 }}
			className={`rounded-2xl border border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] p-4 sm:p-5 ${props.className ?? ""}`}
			renderItem={(item) => <QuickAction data={item} />}
		/>
	);
}
