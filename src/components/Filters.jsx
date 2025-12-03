const categories = [
  { label: 'All', value: 'all' },
  { label: 'Fruits', value: 'fruits' },
  { label: 'Vegetables', value: 'vegetables' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Cereals', value: 'cereals' },
  { label: 'Spices', value: 'spices' },
  { label: 'Packed Food', value: 'packed food' },
]

const sortOptions = [
  { label: 'Popular', value: 'rating_desc' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
]

const Filters = ({ selectedCategory, onCategoryChange, sort, onSortChange }) => (
  <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-600 dark:bg-slate-800">
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            selectedCategory === cat.value
              ? 'bg-primary text-white dark:bg-primary-light'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>

    <select
      value={sort}
      onChange={(e) => onSortChange(e.target.value)}
      className="ml-auto rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

export default Filters
