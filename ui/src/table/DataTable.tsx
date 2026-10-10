"use client";

import { Pin, PinOff } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes, Key, ReactNode } from "react";

export type TableColumn<T> = {
	id: string;
	header: ReactNode;
	cell: (row: T, index: number) => ReactNode;
	width?: CSSProperties["width"];
	align?: "left" | "center" | "right";
	hidden?: boolean;
	/** Set false to disable pinning. Columns start unpinned. */
	pin?: boolean;
	pinLabel?: string;
	cellProps?: (row: T) => HTMLAttributes<HTMLTableCellElement>;
};

export type DataTableProps<T> = {
	rows: readonly T[];
	columns: readonly TableColumn<T>[];
	getRowKey: (row: T) => Key;
	caption: string;
	toolbar?: ReactNode;
	footer?: ReactNode;
	/** Content inside the table scroller, e.g. an infinite-scroll sentinel. */
	scrollFooter?: ReactNode;
	loading?: boolean;
	loadingContent?: ReactNode;
	emptyContent?: ReactNode;
	errorContent?: ReactNode;
	minWidth?: number;
	maxHeight?: CSSProperties["maxHeight"];
	density?: "comfortable" | "compact";
	className?: string;
	/** Row keys to keep visible above/below the scrolling body. Top wins if repeated. */
	rowPinning?: { top?: readonly Key[]; bottom?: readonly Key[] };
	rowProps?: (row: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
};

type DisplayColumn<T> = Omit<TableColumn<T>, "pin"> & {
	canPin: boolean;
	pin?: "left";
};

const alignClasses = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
};

export function DataTable<T>({
	rows,
	columns,
	getRowKey,
	caption,
	toolbar,
	footer,
	scrollFooter,
	loading = false,
	loadingContent = "Loading…",
	emptyContent = "No records found.",
	errorContent,
	minWidth = 880,
	maxHeight,
	density = "comfortable",
	className = "",
	rowProps,
	rowPinning,
}: DataTableProps<T>) {
	const tableRef = useRef<HTMLTableElement>(null);
	const [measurements, setMeasurements] = useState({
		widths: [] as number[],
		heights: [] as number[],
		header: 0,
	});
	const [columnPins, setColumnPins] = useState<Record<string, boolean>>({});
	const visible: DisplayColumn<T>[] = columns
		.filter((column) => !column.hidden)
		.map((column) => ({
			...column,
			canPin: column.pin !== false,
			pin: column.pin !== false && columnPins[column.id] ? "left" : undefined,
		}));
	const toggleColumnPin = (column: DisplayColumn<T>) => {
		if (!column.canPin) return;
		setColumnPins((previous) => ({
			...previous,
			[column.id]: !previous[column.id],
		}));
	};
	const visibleColumns = [
		...visible.filter((column) => column.pin === "left"),
		...visible.filter((column) => !column.pin),
	];
	const topKeys = new Set(rowPinning?.top ?? []);
	const bottomKeys = new Set(rowPinning?.bottom ?? []);
	const indexedRows = rows.map((row, index) => ({
		row,
		index,
		pin: topKeys.has(getRowKey(row))
			? "top"
			: bottomKeys.has(getRowKey(row))
				? "bottom"
				: undefined,
	}));
	const orderedRows = [
		...indexedRows.filter((item) => item.pin === "top"),
		...indexedRows.filter((item) => !item.pin),
		...indexedRows.filter((item) => item.pin === "bottom"),
	];

	// Measure rendered sizes: percentage columns, wrapped content and resized images
	// must contribute their actual width/height to the next sticky offset.
	useLayoutEffect(() => {
		const table = tableRef.current;
		if (
			!table ||
			(!visibleColumns.some((column) => column.pin) &&
				!orderedRows.some((item) => item.pin))
		)
			return;
		const headers = Array.from(
			table.querySelectorAll<HTMLTableCellElement>("thead th"),
		);
		const bodyRows = Array.from(
			table.querySelectorAll<HTMLTableRowElement>("tbody tr"),
		);
		const measure = () => {
			const next = {
				widths: headers.map((cell) => cell.getBoundingClientRect().width),
				heights: bodyRows.map((row) => row.getBoundingClientRect().height),
				header: table.tHead?.getBoundingClientRect().height ?? 0,
			};
			setMeasurements((previous) =>
				previous.header === next.header &&
				previous.widths.length === next.widths.length &&
				previous.widths.every((value, index) => value === next.widths[index]) &&
				previous.heights.length === next.heights.length &&
				previous.heights.every((value, index) => value === next.heights[index])
					? previous
					: next,
			);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(table);
		headers.forEach((cell) => observer.observe(cell));
		bodyRows.forEach((row) => observer.observe(row));
		return () => observer.disconnect();
	});

	const columnStyle = (
		column: DisplayColumn<T>,
		index: number,
	): CSSProperties => {
		if (!column.pin) return {};
		const indices = visibleColumns
			.map((_, i) => i)
			.filter(
				(i) =>
					visibleColumns[i]?.pin === column.pin &&
					(column.pin === "left" ? i < index : i > index),
			);
		const offset = indices.reduce(
			(total, i) => total + (measurements.widths[i] ?? 0),
			0,
		);
		return { position: "sticky", [column.pin]: offset };
	};
	const pinnedRowOffset = (pin: string, index: number) =>
		orderedRows.reduce(
			(total, item, i) =>
				item.pin === pin && (pin === "top" ? i < index : i > index)
					? total + (measurements.heights[i] ?? 0)
					: total,
			pin === "top" ? measurements.header : 0,
		);

	const padding = density === "compact" ? "px-4 py-2" : "px-6 py-4";
	const stateContent = loading
		? loadingContent
		: errorContent != null
			? errorContent
			: rows.length === 0
				? emptyContent
				: undefined;
	if (visibleColumns.length === 0)
		throw new Error("DataTable requires at least one visible column.");

	return (
		<section className={`min-w-0 ${className}`} aria-busy={loading}>
			{toolbar}
			<div
				className="bg-[rgb(var(--color-bg-primary))] rounded-xl border border-[rgb(var(--color-border-primary))] overflow-auto focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-primary))]"
				style={{ maxHeight }}
				tabIndex={0}
				role="region"
				aria-label={caption}
			>
				<table
					ref={tableRef}
					className="w-full table-fixed border-separate border-spacing-0"
					style={{ minWidth }}
				>
					<caption className="sr-only">{caption}</caption>
					<colgroup>
						{visibleColumns.map((column) => (
							<col key={column.id} style={{ width: column.width }} />
						))}
					</colgroup>
					<thead className="sticky top-0 z-10 bg-linear-to-r from-[rgb(var(--color-bg-tertiary))] to-[rgb(var(--color-bg-secondary))]">
						<tr>
							{visibleColumns.map((column, columnIndex) => (
								<th
									key={column.id}
									scope="col"
									style={{
										...columnStyle(column, columnIndex),
										zIndex: column.pin ? 30 : undefined,
									}}
									className={`px-6 py-4 border-b border-[rgb(var(--color-border-primary))] text-xs font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider ${alignClasses[column.align ?? "left"]} ${column.pin ? "bg-[rgb(var(--color-bg-tertiary))]" : ""}`}
								>
									<span
										className={`flex min-w-0 items-center gap-2 ${column.align === "right" ? "justify-end" : column.align === "center" ? "justify-center" : ""}`}
									>
										<span className="min-w-0">{column.header}</span>
										{column.canPin && (
											<button
												type="button"
												aria-pressed={Boolean(column.pin)}
												aria-label={`${column.pin ? "Unpin" : "Pin"} ${column.pinLabel ?? (typeof column.header === "string" || typeof column.header === "number" ? String(column.header) : column.id)} column`}
												title={column.pin ? "Unpin column" : "Pin column"}
												onClick={(event) => {
													event.stopPropagation();
													toggleColumnPin(column);
												}}
												className={`shrink-0 rounded p-1 transition-colors focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-primary))] ${column.pin ? "text-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10" : "text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/10"}`}
											>
												{column.pin ? (
													<PinOff className="h-3.5 w-3.5" aria-hidden />
												) : (
													<Pin className="h-3.5 w-3.5" aria-hidden />
												)}
											</button>
										)}
									</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-[rgb(var(--color-border-primary))]">
						{stateContent !== undefined ? (
							<tr>
								<td
									colSpan={visibleColumns.length}
									className="px-6 py-12 text-center text-sm text-[rgb(var(--color-text-secondary))]"
								>
									<div
										role={errorContent != null && !loading ? "alert" : "status"}
									>
										{stateContent}
									</div>
								</td>
							</tr>
						) : (
							orderedRows.map(({ row, index, pin }, orderedIndex) => {
								const { className: rowClassName = "", ...rest } =
									rowProps?.(row, index) ?? {};
								return (
									<tr
										key={getRowKey(row)}
										{...rest}
										className={`group transition-colors duration-200 hover:bg-[rgb(var(--color-bg-tertiary))] border-b border-[rgb(var(--color-border-primary))] ${rowClassName}`}
									>
										{visibleColumns.map((column, columnIndex) => {
											const {
												className: cellClassName = "",
												style: customCellStyle,
												...cellRest
											} = column.cellProps?.(row) ?? {};
											const isSticky = Boolean(pin || column.pin);
											const stickyStyle: CSSProperties = {
												...customCellStyle,
												...columnStyle(column, columnIndex),
												...(pin
													? {
															position: "sticky",
															[pin]: pinnedRowOffset(pin, orderedIndex),
														}
													: {}),
												...(isSticky
													? { zIndex: pin ? (column.pin ? 20 : 15) : 5 }
													: {}),
											};
											return (
												<td
													key={column.id}
													{...cellRest}
													style={stickyStyle}
													data-pinned-column={column.pin}
													data-pinned-row={pin}
													className={`${padding} text-sm text-[rgb(var(--color-text-primary))] ${alignClasses[column.align ?? "left"]} ${isSticky ? "bg-[rgb(var(--color-bg-primary))] group-hover:bg-[rgb(var(--color-bg-tertiary))]" : ""} ${cellClassName}`}
												>
													{column.cell(row, index)}
												</td>
											);
										})}
									</tr>
								);
							})
						)}
					</tbody>
				</table>
				{scrollFooter}
			</div>
			{footer}
		</section>
	);
}
