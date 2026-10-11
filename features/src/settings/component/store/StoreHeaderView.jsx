"use client";
export function StoreHeaderView({ model }) {
  const { isLoading, storesCount } = model;
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
          Store Management
        </h2>
        <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
          {isLoading
            ? "Loading..."
            : `${storesCount} ${storesCount === 1 ? "store" : "stores"} registered`}
        </p>
      </div>
      {/* Add New Store button removed as per latest design */}
    </div>
  );
}
