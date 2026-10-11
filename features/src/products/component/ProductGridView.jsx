"use client";
export function ProductGridPresentation({ model }) {
  const {
    className,
    props,
    products,
    selectAll,
    handleSelectAll,
    t,
    selectedProducts,
    ProductCard,
    handleProductSelect,
    onEdit,
    onDelete,
    onDuplicate,
    onViewDetails,
  } = model;
  return (
    <div
      className={`bg-[rgb(var(--color-bg-primary))] rounded-xl  ${className}`}
      {...props}
    >
      {/* Select All Checkbox - Fixed at top */}
      {products.length > 0 && (
        <div className="bg-gradient-to-r from-[rgb(var(--color-bg-tertiary))] to-[rgb(var(--color-bg-secondary))] border-b border-[rgb(var(--color-border-primary))] px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="w-4 h-4 text-[rgb(var(--color-primary))] border-[rgb(var(--color-border-primary))] rounded focus:ring-[rgb(var(--color-primary))] focus:ring-2"
            />
            <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">
              {t("products.selectAllProducts", { count: products.length })}
            </span>
            {selectedProducts.length > 0 && (
              <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                {selectedProducts.length} {t("products.selected")}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {products.map((product, _index) => (
          <div key={product.id} className="relative">
            <ProductCard
              product={product}
              selected={selectedProducts.includes(product.id)}
              onSelect={handleProductSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onViewDetails={onViewDetails}
              className="transition-all duration-300 ease-out"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
