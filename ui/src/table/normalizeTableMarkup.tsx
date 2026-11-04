import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { Children, cloneElement, Fragment, isValidElement } from "react";
import type { TableColumn } from "./DataTable";

type Cell = ReactElement<
	HTMLAttributes<HTMLTableCellElement> & {
		children?: ReactNode;
		colSpan?: number;
	}
>;
export type MarkupRow = {
	key: string;
	element: ReactElement<
		HTMLAttributes<HTMLTableRowElement> & { children?: ReactNode }
	>;
	cells: Cell[];
};

function elements(
	children: ReactNode,
): ReactElement<{ children?: ReactNode }>[] {
	return Children.toArray(children).flatMap((child) => {
		if (!isValidElement<{ children?: ReactNode }>(child)) return [];
		return child.type === Fragment ? elements(child.props.children) : [child];
	});
}

function headerText(children: ReactNode): string {
	return Children.toArray(children)
		.map((child) => {
			if (typeof child === "string" || typeof child === "number")
				return String(child);
			return isValidElement<{ children?: ReactNode }>(child)
				? headerText(child.props.children)
				: "";
		})
		.join(" ")
		.trim();
}

// Feature adapters keep their cell content/events. Shared table UI owns sizing,
// padding, header/row colours and scrolling for both data and JSX column APIs.
function contentClass(className = "") {
	return className
		.split(/\s+/)
		.filter(
			(token) =>
				!/^(?:w-|min-w-|max-w-|p[xytrbl]?-|bg-|border(?:-|$)|divide-|hover:bg-)/.test(
					token,
				),
		)
		.join(" ");
}
function cellProps(cell?: Cell) {
	if (!cell) return {};
	const {
		children: _children,
		colSpan: _colSpan,
		className,
		style,
		...props
	} = cell.props;
	const {
		width: _width,
		minWidth: _minWidth,
		padding: _padding,
		paddingLeft: _left,
		paddingRight: _right,
		...contentStyle
	} = style ?? {};
	return { ...props, className: contentClass(className), style: contentStyle };
}

function expandNumberSpan(cells: Cell[], showNumbers: boolean) {
	return cells.map((cell, index) =>
		cloneElement(cell, {
			key: cell.key ?? index,
			...cellProps(cell),
			colSpan: (cell.props.colSpan ?? 1) + (showNumbers && index === 0 ? 1 : 0),
		}),
	);
}

function footerWithNumbers(
	footer: ReactElement<{ children?: ReactNode }> | undefined,
	showNumbers: boolean,
) {
	if (!footer) return undefined;
	return cloneElement(
		footer,
		{},
		elements(footer.props.children).map((row, index) =>
			cloneElement(
				row,
				{ key: row.key ?? index },
				expandNumberSpan(elements(row.props.children) as Cell[], showNumbers),
			),
		),
	);
}

/** Convert the JSX column API into the same row/column model as the data API. */
export function normalizeTableMarkup(
	children: ReactNode,
	showNumbers: boolean,
) {
	const sections = elements(children);
	const header = sections.find((section) => section.type === "thead");
	const headers = elements(
		elements(header?.props.children)[0]?.props.children,
	) as Cell[];
	const bodies = sections.filter((section) => section.type === "tbody");
	const rows: MarkupRow[] = bodies
		.flatMap((body) => elements(body.props.children))
		.map((element, index) => {
			if (element.type !== "tr")
				throw new Error(
					"DataTable JSX rows must be native <tr> elements. Use the rows/columns API for custom row components.",
				);
			return {
				key: String(element.key ?? index),
				element,
				cells: elements(element.props.children) as Cell[],
			};
		});
	if (!headers.length)
		throw new Error(
			"DataTable JSX API requires a thead with column headers. Render the header and body in one DataTable.",
		);
	const columns: TableColumn<MarkupRow>[] = headers.map((headerCell, index) => {
		const classes = headerCell.props.className ?? "";
		const pinLabel = headerText(headerCell.props.children);
		const fitContent = /(?:^|\s)w-(?:\d+|px)(?=\s|$)/.test(classes);
		return {
			id: `column-${index}`,
			pinLabel,
			pin: Boolean(pinLabel) && !fitContent,
			header: headerCell.props.children,
			headerProps: cellProps(headerCell),
			align: classes.includes("text-right")
				? "right"
				: classes.includes("text-center")
					? "center"
					: "left",
			fitContent,
			cell: (row) => row.cells[index]?.props.children,
			cellProps: (row) => cellProps(row.cells[index]),
		};
	});
	const footer = sections.find((section) => section.type === "tfoot");
	return {
		rows,
		columns,
		getRowKey: (row: MarkupRow) => row.key,
		rowProps: (row: MarkupRow) => {
			const { children: _children, className, ...props } = row.element.props;
			return { ...props, className };
		},
		// Merged summary/group/empty rows retain semantics and the number-column span.
		renderCells: (row: MarkupRow) =>
			row.cells.some((cell) => (cell.props.colSpan ?? 1) > 1)
				? expandNumberSpan(row.cells, showNumbers)
				: undefined,
		tableFooter: footerWithNumbers(footer, showNumbers),
	};
}
