"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeStoreSummary } from "../model/summary.js";

export function useDashboardData({
	repository,
	storeId,
	ready = true,
	isStaff = false,
	initialSummary,
	onSummary,
	salesTrendDays = 7,
}) {
	const initialRows = Array.isArray(initialSummary)
		? normalizeStoreSummary(initialSummary)
		: [];
	const hasInitial = initialRows.length > 0;

	// Core store dashboard state (atomic to minimize re-render passes)
	const [mainState, setMainState] = useState(() => ({
		summary: initialRows,
		today: null,
		loading: !isStaff && !hasInitial,
		error: null,
	}));

	// Sales trend state
	const [trendState, setTrendState] = useState(() => ({
		data: [],
		loading: false,
		error: null,
	}));

	const [retryCount, setRetryCount] = useState(0);
	const retry = useCallback(() => setRetryCount((v) => v + 1), []);

	// Stable refs to eliminate unneeded effect re-executions & race conditions
	const onSummaryRef = useRef(onSummary);
	onSummaryRef.current = onSummary;

	const loadedStoreIdRef = useRef(hasInitial ? storeId : null);
	const mainRequestIdRef = useRef(0);
	const trendRequestIdRef = useRef(0);

	// Sync initialSummary updates from parent
	useEffect(() => {
		if (Array.isArray(initialSummary)) {
			const normalized = normalizeStoreSummary(initialSummary);
			loadedStoreIdRef.current = storeId;
			setMainState((prev) => ({
				...prev,
				summary: normalized,
				loading: false,
			}));
		}
	}, [initialSummary, storeId]);

	// Fetch Summary & Cashbook concurrently (O(1) request sequence tracking)
	useEffect(() => {
		if (!ready || !storeId || isStaff) return;

		const requestId = ++mainRequestIdRef.current;
		const isInitialForStore = loadedStoreIdRef.current !== storeId;

		setMainState((prev) => ({
			...prev,
			loading: isInitialForStore ? true : prev.loading,
			error: null,
		}));

		const summaryPromise = repository.getSummary({ storeId });
		const cashbookPromise = repository.getCashbook
			? repository.getCashbook({ storeId })
			: Promise.resolve(null);

		Promise.allSettled([summaryPromise, cashbookPromise]).then(
			([summaryRes, cashbookRes]) => {
				if (requestId !== mainRequestIdRef.current) return;

				let newSummary;
				let summaryError = null;

				if (summaryRes.status === "fulfilled") {
					if (!Array.isArray(summaryRes.value)) {
						summaryError = "Unable to load dashboard data. Please try again.";
					} else {
						newSummary = normalizeStoreSummary(summaryRes.value);
						loadedStoreIdRef.current = storeId;
						onSummaryRef.current?.(newSummary);
					}
				} else {
					summaryError =
						summaryRes.reason?.message || "Unable to load dashboard data.";
				}

				const newToday =
					cashbookRes.status === "fulfilled"
						? (cashbookRes.value?.today ?? null)
						: null;

				setMainState((prev) => ({
					summary: newSummary !== undefined ? newSummary : prev.summary,
					today: newToday,
					loading: false,
					error: summaryError,
				}));
			},
		);

		return () => {
			if (mainRequestIdRef.current === requestId) {
				mainRequestIdRef.current++;
			}
		};
	}, [repository, storeId, ready, isStaff, retryCount]);

	// Fetch Sales Trend (isolated to avoid re-fetching summary when trend days change)
	useEffect(() => {
		if (!ready || !storeId || isStaff || !repository.getSalesTrend) {
			setTrendState({ data: [], loading: false, error: null });
			return;
		}

		const requestId = ++trendRequestIdRef.current;
		setTrendState((prev) => ({ ...prev, loading: true, error: null }));

		repository
			.getSalesTrend({ storeId, days: salesTrendDays })
			.then((value) => {
				if (requestId !== trendRequestIdRef.current) return;
				if (!Array.isArray(value)) {
					throw new Error("Sales trend data is unavailable.");
				}
				setTrendState({ data: value, loading: false, error: null });
			})
			.catch((err) => {
				if (requestId !== trendRequestIdRef.current) return;
				setTrendState({
					data: [],
					loading: false,
					error: err?.message || "Sales trend is unavailable.",
				});
			});

		return () => {
			if (trendRequestIdRef.current === requestId) {
				trendRequestIdRef.current++;
			}
		};
	}, [repository, storeId, ready, isStaff, salesTrendDays, retryCount]);

	return {
		summary: mainState.summary,
		loading: mainState.loading,
		today: mainState.today,
		salesTrend: trendState.data,
		salesTrendLoading: trendState.loading,
		salesTrendError: trendState.error,
		error: mainState.error,
		retry,
	};
}
