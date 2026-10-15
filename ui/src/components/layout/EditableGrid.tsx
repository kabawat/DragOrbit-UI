"use client";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import "./layout.css";

/** Serializable presentation only. Storage and scope belong to the consumer. */
export type GridLayout = {
	order: string[];
	columns: number;
	widthPercent: number;
	minHeight: number;
};
export type LayoutLabels = {
	save: string;
	cancel: string;
	columns: string;
	reorder: string;
	saveError: string;
	editing: string;
};
export const defaultLayoutLabels: LayoutLabels = {
	save: "Save layout",
	cancel: "Cancel",
	columns: "Columns",
	reorder: "Drag or use arrow keys to arrange",
	saveError: "Could not save layout. Try again.",
	editing: "Editing layout",
};
export function normalizeGridLayout(
	layout: Partial<GridLayout> | undefined,
	ids: string[],
	maxCol: number,
): GridLayout {
	const clamp = (value: unknown, fallback: number, min: number, max: number) =>
		typeof value === "number" && Number.isFinite(value)
			? Math.max(min, Math.min(max, Math.round(value)))
			: fallback;
	const savedOrder = Array.isArray(layout?.order) ? layout.order : [];
	const order = [
		...new Set(savedOrder.filter((id) => ids.includes(id))),
		...ids.filter((id) => !savedOrder.includes(id)),
	];
	return {
		order,
		columns: clamp(layout?.columns, maxCol, 1, maxCol),
		widthPercent: 100,
		minHeight: 0,
	};
}
export type EditableGridProps<T extends { id: string }> = {
	data: readonly T[];
	renderItem: (item: T) => ReactNode;
	maxCol?: number;
	minCol?: number;
	layout?: Partial<GridLayout>;
	/** Optional opt-out; ordering is enabled by default. */
	reorderable?: boolean;
	onSave?: (layout: GridLayout) => void | Promise<void>;
	title?: ReactNode;
	labels?: Partial<LayoutLabels>;
	className?: string;
	itemMinWidth?: number;
	loading?: boolean;
};
type DragPosition = {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
};
export function EditableGrid<T extends { id: string }>({
	data,
	renderItem,
	maxCol = 5,
	minCol = 1,
	layout,
	reorderable = true,
	onSave,
	title,
	labels,
	className = "",
	itemMinWidth = 180,
	loading = false,
}: EditableGridProps<T>) {
	const cap = Number.isFinite(maxCol)
		? Math.max(1, Math.min(12, Math.floor(maxCol)))
		: 5;
	const ids = data.map((item) => item.id),
		idsKey = JSON.stringify(ids),
		layoutKey = JSON.stringify(layout ?? {});
	const [draft, setDraft] = useState(() =>
		normalizeGridLayout(layout, ids, cap),
	);
	const draftRef = useRef(draft);
	const savingRef = useRef(false);
	const suppressClick = useRef(false);
	const [saving, setSaving] = useState(false),
		[error, setError] = useState("");
	const [announcement, setAnnouncement] = useState("");
	const [drag, setDrag] = useState<DragPosition | null>(null);
	const gesture = useRef<{
		id: string;
		pointerId: number;
		startX: number;
		startY: number;
		left: number;
		top: number;
		width: number;
		height: number;
		moving: boolean;
		originalOrder: string[];
	} | null>(null);
	const grid = useRef<HTMLDivElement>(null);
	const l = { ...defaultLayoutLabels, ...labels };
	useEffect(() => {
		draftRef.current = normalizeGridLayout(layout, JSON.parse(idsKey), cap);
		setDraft(draftRef.current);
		setError("");
		setDrag(null);
		gesture.current = null;
	}, [layoutKey, idsKey, cap, reorderable]);
	const current = normalizeGridLayout(draft, ids, cap);
	const minimumColumns = Math.max(1, Math.min(cap, Math.floor(minCol) || 1));
	const columns = Math.max(minimumColumns, current.columns);
	const itemWidth = Number.isFinite(itemMinWidth) ? Math.max(120, itemMinWidth) : 180;
	// CSS fits columns on the first paint, including consumers with a forced minimum.
	const minimumTrack = `min(calc((100% - ${minimumColumns - 1}rem) / ${minimumColumns}), max(${itemWidth}px, calc((100% - ${columns - 1}rem) / ${columns})))`;
	const items = current.order
		.map((id) => data.find((item) => item.id === id))
		.filter((item): item is T => Boolean(item));
	const persist = async (next: GridLayout) => {
		if (!onSave || savingRef.current) return;
		savingRef.current = true;
		setSaving(true);
		setError("");
		try {
			await onSave(next);
		} catch {
			setError(l.saveError);
		} finally {
			savingRef.current = false;
			setSaving(false);
		}
	};
	const reorder = (id: string, target: string) => {
		if (id === target) return;
		const order = normalizeGridLayout(draftRef.current, ids, cap).order;
		const from = order.indexOf(id),
			to = order.indexOf(target);
		if (from < 0 || to < 0) return;
		order.splice(to, 0, ...order.splice(from, 1));
		draftRef.current = { ...draftRef.current, order };
		setDraft(draftRef.current);
		setAnnouncement(`${l.reorder}: ${to + 1}`);
	};
	const begin = (event: PointerEvent<HTMLDivElement>, id: string) => {
		if (savingRef.current || gesture.current || event.button !== 0) return;
		suppressClick.current = false;
		event.preventDefault();
		event.currentTarget.focus();

		const rect = event.currentTarget.getBoundingClientRect();
		gesture.current = {
			id,
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			left: rect.left,
			top: rect.top,
			width: rect.width,
			height: rect.height,
			moving: false,
			originalOrder: [...current.order],
		};
	};
	const move = (
		event: Pick<
			PointerEvent<HTMLDivElement>,
			"pointerId" | "clientX" | "clientY"
		>,
	) => {
		const start = gesture.current;
		if (!start || event.pointerId !== start.pointerId) return;
		const dx = event.clientX - start.startX,
			dy = event.clientY - start.startY;
		if (!start.moving && Math.hypot(dx, dy) < 5) return;
		start.moving = true;
		setDrag({
			id: start.id,
			x: start.left + dx,
			y: start.top + dy,
			width: start.width,
			height: start.height,
		});
		const target = document
			.elementFromPoint(event.clientX, event.clientY)
			?.closest<HTMLElement>("[data-grid-item]");
		if (target && grid.current?.contains(target) && target.dataset.gridItem)
			reorder(start.id, target.dataset.gridItem);
	};
	const end = (cancel = false) => {
		const start = gesture.current;
		if (!start) return;
		suppressClick.current = start.moving;
		if (cancel) {
			draftRef.current = { ...draftRef.current, order: start.originalOrder };
			setDraft(draftRef.current);
		}
		gesture.current = null;
		setDrag(null);
		if (
			!cancel &&
			start.moving &&
			JSON.stringify(start.originalOrder) !==
				JSON.stringify(draftRef.current.order)
		)
			void persist(normalizeGridLayout(draftRef.current, ids, cap));
	};
	const keyReorder = (event: KeyboardEvent<HTMLDivElement>, id: string) => {
		if (event.key === "Escape") {
			event.preventDefault();
			end(true);
			return;
		}
		const delta = ["ArrowLeft", "ArrowUp"].includes(event.key)
			? -1
			: ["ArrowRight", "ArrowDown"].includes(event.key)
				? 1
				: 0;
		if (!delta || savingRef.current) return;
		event.preventDefault();
		const target = current.order[current.order.indexOf(id) + delta];
		if (target) {
			reorder(id, target);
			void persist(normalizeGridLayout(draftRef.current, ids, cap));
		}
	};
	// Global pointer listeners keep dragging alive when reordering moves the DOM node.
	const moveLatest = useRef(move),
		endLatest = useRef(end);
	moveLatest.current = move;
	endLatest.current = end;
	useEffect(() => {
		const movePointer = (event: globalThis.PointerEvent) =>
			moveLatest.current(event);
		const finish = (event: globalThis.PointerEvent) => {
			if (gesture.current?.pointerId === event.pointerId)
				endLatest.current(event.type === "pointercancel");
		};
		const cancel = () => {
			if (gesture.current) endLatest.current(true);
		};
		window.addEventListener("pointermove", movePointer);
		window.addEventListener("pointerup", finish);
		window.addEventListener("pointercancel", finish);
		window.addEventListener("blur", cancel);
		return () => {
			window.removeEventListener("pointermove", movePointer);
			window.removeEventListener("pointerup", finish);
			window.removeEventListener("pointercancel", finish);
			window.removeEventListener("blur", cancel);
			gesture.current = null;
		};
	}, []);

	const draggedItem = drag
		? data.find((item) => item.id === drag.id)
		: undefined;
	return (
		<section
			className={`dragorbit-editable-grid min-w-0 relative ${className}`}
			aria-busy={saving || loading}
		>
			{title && (
				<h2 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-4">
					{title}
				</h2>
			)}
			{error && (
				<p role="alert" className="mb-3 text-sm text-red-600">
					{error}
				</p>
			)}
			<div
				ref={grid}
				className="grid gap-4"
				style={{
					gridTemplateColumns: `repeat(auto-fill, minmax(${minimumTrack}, 1fr))`,
				}}
			>
				{items.map((item) => (
					<div
						key={item.id}
						data-grid-item={item.id}
						role={reorderable ? "group" : undefined}
						aria-roledescription={reorderable ? "sortable card" : undefined}
						tabIndex={reorderable && !saving ? 0 : undefined}
						aria-label={reorderable ? `${l.reorder}: ${item.id}` : undefined}
						aria-disabled={reorderable ? saving : undefined}
						className={`min-w-0 relative dragorbit-grid-item ${reorderable ? "cursor-grab active:cursor-grabbing touch-none select-none focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-primary))] rounded-2xl" : ""} ${drag?.id === item.id ? "opacity-25" : ""}`}
						onClickCapture={(event) => {
							if (suppressClick.current) {
								event.preventDefault();
								event.stopPropagation();
								suppressClick.current = false;
							}
						}}
						onPointerDownCapture={
							reorderable ? (event) => begin(event, item.id) : undefined
						}
						onKeyDown={
							reorderable ? (event) => keyReorder(event, item.id) : undefined
						}
					>
						<div className="h-full">{renderItem(item)}</div>
					</div>
				))}
			</div>
			<span role="status" aria-live="polite" className="sr-only">
				{announcement}
			</span>
			{drag &&
				draggedItem &&
				createPortal(
					<div
						aria-hidden="true"
						className="pointer-events-none fixed z-[10050] scale-[1.02] shadow-xl rounded-2xl"
						style={{
							left: 0,
							top: 0,
							width: drag.width,
							height: drag.height,
							transform: `translate3d(${drag.x}px, ${drag.y}px, 0) scale(1.02)`,
						}}
					>
						<div inert>{renderItem(draggedItem)}</div>
					</div>,
					document.body,
				)}
		</section>
	);
}
