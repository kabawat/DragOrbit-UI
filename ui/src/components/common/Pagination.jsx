"use client";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const Pagination = ({
	currentPage = 1,
	totalPages = 1,
	onPageChange,
	showFirstLast = true,
	showPrevNext = true,
	maxVisiblePages = 5,
	className = "",
	...props
}) => {
	// Calculate visible page numbers
	const getVisiblePages = () => {
		const pages = [];
		const halfVisible = Math.floor(maxVisiblePages / 2);

		let startPage = Math.max(1, currentPage - halfVisible);
		let endPage = Math.min(totalPages, currentPage + halfVisible);

		// Adjust if we're near the beginning or end
		if (currentPage <= halfVisible) {
			endPage = Math.min(totalPages, maxVisiblePages);
		}
		if (currentPage > totalPages - halfVisible) {
			startPage = Math.max(1, totalPages - maxVisiblePages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		return pages;
	};

	const visiblePages = getVisiblePages();

	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages && page !== currentPage) {
			onPageChange?.(page);
		}
	};

	if (totalPages <= 1) return null;

	return (
		<nav
			className={`flex items-center justify-center space-x-1 ${className}`}
			{...props}
		>
			{/* First Page */}
			{showFirstLast && currentPage > 1 && (
				<button
					onClick={() => handlePageChange(1)}
					className="px-3 py-2 text-sm font-medium text-[rgb(var(--color-text-primary))] bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] transition-colors duration-200"
					aria-label="Go to first page"
				>
					First
				</button>
			)}

			{/* Previous Page */}
			{showPrevNext && (
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="px-3 py-2 text-sm font-medium text-[rgb(var(--color-text-primary))] bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
					aria-label="Go to previous page"
				>
					<ChevronLeft className="w-4 h-4" />
				</button>
			)}

			{/* Page Numbers */}
			<div className="flex items-center space-x-1">
				{/* Show ellipsis at start if needed */}
				{visiblePages[0] > 1 && (
					<>
						<button
							onClick={() => handlePageChange(1)}
							className="px-3 py-2 text-sm font-medium text-[rgb(var(--color-text-primary))] bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] transition-colors duration-200"
						>
							1
						</button>
						{visiblePages[0] > 2 && (
							<span className="px-2 py-2 text-[rgb(var(--color-text-tertiary))]">
								<MoreHorizontal className="w-4 h-4" />
							</span>
						)}
					</>
				)}

				{/* Visible page numbers */}
				{visiblePages.map((page) => (
					<button
						key={page}
						onClick={() => handlePageChange(page)}
						className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
							page === currentPage
								? "bg-[rgb(var(--color-primary))] text-white border border-[rgb(var(--color-primary))]"
								: "text-[rgb(var(--color-text-primary))] bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] hover:bg-[rgb(var(--color-bg-secondary))]"
						}`}
						aria-label={`Go to page ${page}`}
						aria-current={page === currentPage ? "page" : undefined}
					>
						{page}
					</button>
				))}

				{/* Show ellipsis at end if needed */}
				{visiblePages[visiblePages.length - 1] < totalPages && (
					<>
						{visiblePages[visiblePages.length - 1] < totalPages - 1 && (
							<span className="px-2 py-2 text-[rgb(var(--color-text-tertiary))]">
								<MoreHorizontal className="w-4 h-4" />
							</span>
						)}
						<button
							onClick={() => handlePageChange(totalPages)}
							className="px-3 py-2 text-sm font-medium text-[rgb(var(--color-text-primary))] bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] transition-colors duration-200"
						>
							{totalPages}
						</button>
					</>
				)}
			</div>

			{/* Next Page */}
			{showPrevNext && (
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="px-3 py-2 text-sm font-medium text-[rgb(var(--color-text-primary))] bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
					aria-label="Go to next page"
				>
					<ChevronRight className="w-4 h-4" />
				</button>
			)}

			{/* Last Page */}
			{showFirstLast && currentPage < totalPages && (
				<button
					onClick={() => handlePageChange(totalPages)}
					className="px-3 py-2 text-sm font-medium text-[rgb(var(--color-text-primary))] bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] transition-colors duration-200"
					aria-label="Go to last page"
				>
					Last
				</button>
			)}
		</nav>
	);
};

export default Pagination;
