import { FiSearch } from 'react-icons/fi'

const SearchBar = ({ value, onChange }) => (
  <div className="flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 shadow-sm focus-within:border-primary-400 dark:border-slate-600 dark:bg-slate-800 dark:focus-within:border-primary-light/60">
    <FiSearch className="text-primary-600 dark:text-slate-400" />
    <input
      type="search"
      placeholder="Search fruits, dairy, snacks..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
    />
  </div>
)

export default SearchBar
