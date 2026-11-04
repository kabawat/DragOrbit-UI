"use client";

import { Children, cloneElement, Fragment, isValidElement } from "react";
import type { ReactElement, ReactNode, TableHTMLAttributes } from "react";

export function RowNumber({ value }: { value: number }) {
	return (
		<span className="tabular-nums text-[rgb(var(--color-text-secondary))]">
			{value}
		</span>
	);
}

const numberStyle = {
	width: 64,
	minWidth: 64,
	paddingLeft: 12,
	paddingRight: 12,
	whiteSpace: "nowrap" as const,
};

export function RowNumberCell({ value }: { value: number }) {
	return (
		<td style={numberStyle} className="py-3 text-center text-sm">
			<RowNumber value={value} />
		</td>
	);
}

/** Adds the shared number column to legacy tables whose rows are native JSX. */
export function NumberedTable({
	children,
	showNumOfData = true,
	rowNumberOffset = 0,
	loading = false,
	...props
}: TableHTMLAttributes<HTMLTableElement> & {
	showNumOfData?: boolean;
	rowNumberOffset?: number;
	loading?: boolean;
}) {
	let rowNumber = rowNumberOffset;
	const transform = (nodes: ReactNode, section?: string): ReactNode =>
		Children.map(nodes, (child) => {
			if (!isValidElement(child)) return child;
			const element = child as ReactElement<{
				children?: ReactNode;
				colSpan?: number;
			}>;
			if (element.type === Fragment)
				return cloneElement(
					element,
					{},
					transform(element.props.children, section),
				);
			if (typeof element.type !== "string") return element;
			if (["thead", "tbody", "tfoot"].includes(element.type))
				return cloneElement(
					element,
					{},
					transform(element.props.children, element.type),
				);
			if (element.type === "colgroup")
				return cloneElement(
					element,
					{},
					<col key="__rowNumber" style={{ width: 64 }} />,
					element.props.children,
				);
			if (element.type !== "tr") return element;
			const cells = Children.toArray(element.props.children);
			// Empty, loading, and totals rows with merged cells must retain their span.
			if (
				cells.some(
					(cell) =>
						isValidElement<{ colSpan?: number }>(cell) &&
						(cell.props.colSpan ?? 1) > 1,
				)
			) {
				let expanded = false;
				return cloneElement(
					element,
					{},
					Children.map(element.props.children, (cell) => {
						if (
							!expanded &&
							isValidElement<{ colSpan?: number }>(cell) &&
							(cell.props.colSpan ?? 1) > 1
						) {
							expanded = true;
							return cloneElement(cell, { colSpan: cell.props.colSpan! + 1 });
						}
						return cell;
					}),
				);
			}
			if (section === "thead")
				return cloneElement(
					element,
					{},
					<th
						key="__rowNumber"
						scope="col"
						style={numberStyle}
						className="py-3 text-center text-xs font-semibold uppercase text-[rgb(var(--color-text-secondary))]"
					>
						SR NO
					</th>,
					element.props.children,
				);
			if (section !== "tbody")
				return cloneElement(
					element,
					{},
					<td key="__rowNumber" />,
					element.props.children,
				);
			rowNumber += 1;
			return cloneElement(
				element,
				{},
				loading ? (
					<td key="__rowNumber" style={numberStyle}>
						<span className="mx-auto block h-4 w-5 animate-pulse rounded bg-[rgb(var(--color-bg-tertiary))]" />
					</td>
				) : (
					<RowNumberCell key="__rowNumber" value={rowNumber} />
				),
				element.props.children,
			);
		});
	return (
		<table {...props}>{showNumOfData ? transform(children) : children}</table>
	);
}
