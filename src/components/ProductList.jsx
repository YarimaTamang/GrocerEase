import ProductCard from './ProductCard.jsx'

const ProductList = ({ products = [], onSelect, loading, searchQuery = '' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-3xl bg-white p-4 shadow-card dark:bg-slate-800 dark:shadow-slate-700"
          >
            <div className="mb-4 h-36 rounded-2xl bg-slate-100 dark:bg-slate-700" />
            <div className="h-4 rounded bg-slate-100 dark:bg-slate-600" />
            <div className="mt-2 h-3 rounded bg-slate-100 dark:bg-slate-600" />
            <div className="mt-4 h-3 rounded bg-slate-100 dark:bg-slate-600" />
          </div>
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
        {searchQuery ? (
          <>
            <p className="text-lg font-semibold text-slate-700 mb-2 dark:text-slate-300">No products found for "{searchQuery}"</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Try searching for fruits, vegetables, dairy, cereals, spices, or packed food</p>
          </>
        ) : (
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">No products match your filters yet.</p>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={onSelect} />
      ))}
    </div>
  )
}

export default ProductList
