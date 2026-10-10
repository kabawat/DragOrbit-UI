"use client";

const Table = ({ children, className = "", ...props }) => {
	return (
		<div className="overflow-x-auto">
			<table
				className={`min-w-full divide-y divide-[rgb(var(--color-border-primary))] ${className}`}
				{...props}
			>
				{children}
			</table>
		</div>
	);
};

const TableHeader = ({ children, className = "", ...props }) => {
	return (
		<thead
			className={`bg-[rgb(var(--color-bg-secondary))] ${className}`}
			{...props}
		>
			{children}
		</thead>
	);
};

const TableBody = ({ children, className = "", ...props }) => {
	return (
		<tbody
			className={`bg-[rgb(var(--color-bg-primary))] divide-y divide-[rgb(var(--color-border-primary))] ${className}`}
			{...props}
		>
			{children}
		</tbody>
	);
};

const TableRow = ({ children, className = "", ...props }) => {
	return (
		<tr
			className={`hover:bg-[rgb(var(--color-bg-secondary))] transition-colors ${className}`}
			{...props}
		>
			{children}
		</tr>
	);
};

const TableHead = ({ children, className = "", ...props }) => {
	return (
		<th
			className={`px-6 py-3 text-left text-xs font-medium text-[rgb(var(--color-text-secondary))] uppercase tracking-wider ${className}`}
			{...props}
		>
			{children}
		</th>
	);
};

const TableCell = ({ children, className = "", ...props }) => {
	return (
		<td
			className={`px-6 py-4 whitespace-nowrap text-sm text-[rgb(var(--color-text-primary))] ${className}`}
			{...props}
		>
			{children}
		</td>
	);
};

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
export default Table;
