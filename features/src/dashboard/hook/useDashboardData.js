"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeStoreSummary } from "../model/summary";
export function useDashboardData({
	repository,
	storeId,
	ready = true,
	isStaff,
	initialSummary,
	onSummary,
}) {
	const [summary, setSummary] = useState(normalizeStoreSummary(initialSummary));
	const [loading, setLoading] = useState(
		!isStaff && !Array.isArray(initialSummary),
	);
	const [error, setError] = useState(null);
	const [retryCount, setRetryCount] = useState(0);
	const hasLoaded = useRef(Array.isArray(initialSummary));
	const retry = useCallback(() => setRetryCount((value) => value + 1), []);
	const [today, setToday] = useState(null);
	const cached = useRef(summary);
	useEffect(() => {
		if (Array.isArray(initialSummary)) {
			hasLoaded.current = true;
			cached.current = normalizeStoreSummary(initialSummary);
			setSummary(cached.current);
		}
	}, [initialSummary]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: retryCount explicitly retries the current repository query.
	useEffect(() => {
		if (!ready || !storeId || isStaff) return;
		let cancelled = false;
		setLoading(!hasLoaded.current);
		setError(null);
		Promise.resolve()
			.then(() => repository.getSummary({ storeId }))
			.then((rows) => {
				if (cancelled) return;
				if (!Array.isArray(rows))
					throw new Error("Unable to load dashboard data. Please try again.");
				hasLoaded.current = true;
				cached.current = normalizeStoreSummary(rows);
				setSummary(cached.current);
				onSummary?.(cached.current);
			})
			.catch((error) => {
				if (!cancelled) {
					setError(error?.message || "Unable to load dashboard data.");
					setSummary(cached.current);
				}
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [repository, storeId, ready, isStaff, onSummary, retryCount]);
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
	return { summary, loading, today, error, retry };
}
