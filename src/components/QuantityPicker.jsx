const QuantityPicker = ({ value, onChange, min = 1, max = 20 }) => (
  <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-600 dark:bg-slate-700">
    <button
      onClick={() => value > min && onChange(value - 1)}
      className="h-7 w-7 rounded-full bg-slate-100 text-lg font-semibold text-slate-700 dark:bg-slate-600 dark:text-slate-200"
    >
      −
    </button>
    <span className="w-6 text-center text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</span>
    <button
      onClick={() => value < max && onChange(value + 1)}
      className="h-7 w-7 rounded-full bg-primary text-lg font-semibold text-white dark:bg-primary-light"
    >
      +
    </button>
  </div>
)

export default QuantityPicker
