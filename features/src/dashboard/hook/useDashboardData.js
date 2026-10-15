"use client";
import { normalizeStoreSummary } from "../model/summary";
import { useEffect, useRef, useState } from "react";
export function useDashboardData({
	repository,
	storeId,
	ready = true,
	isStaff,
	initialSummary,
	onSummary,
}) {
	const [summary, setSummary] = useState(normalizeStoreSummary(initialSummary));
	const [loading, setLoading] = useState(false);
	const [today, setToday] = useState(null);
	const cached = useRef(summary);
	useEffect(() => {
		if (Array.isArray(initialSummary)) {
			cached.current = normalizeStoreSummary(initialSummary);
			setSummary(cached.current);
		}
	}, [initialSummary]);
	useEffect(() => {
		if (!ready || !storeId || isStaff) return;
		let cancelled = false;
		setLoading(true);
		Promise.resolve()
			.then(() => repository.getSummary({ storeId }))
			.then((rows) => {
				if (cancelled || !Array.isArray(rows)) return;
				cached.current = normalizeStoreSummary(rows);
				setSummary(cached.current);
				onSummary?.(cached.current);
			})
			.catch(() => {
				if (!cancelled) setSummary(cached.current);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [repository, storeId, ready, isStaff, onSummary]);
	useEffect(() => {
		setToday(null);
		if (!ready || !storeId || isStaff || !repository.getCashbook) return;
		let cancelled = false;
		Promise.resolve()
			.then(() => repository.getCashbook({ storeId }))
			.then((value) => {
				if (!cancelled) setToday(value?.today ?? null);
			})
			.catch(() => {
				if (!cancelled) setToday(null);
			});
		return () => {
			cancelled = true;
		};
	}, [repository, storeId, ready, isStaff]);
	return { summary, loading, today };
}
