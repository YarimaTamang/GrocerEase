import { FiStar, FiPlus } from 'react-icons/fi'
import { useCart } from '../context/CartContext.jsx'
import { formatCurrency } from '../utils/helpers.js'

const ProductCard = ({ product, onSelect }) => {
  const { addToCart } = useCart()

  return (
    <div className="group flex flex-col rounded-3xl border border-transparent bg-white p-4 shadow-card transition hover:-translate-y-1 hover:border-primary/40 dark:bg-slate-800 dark:shadow-slate-700">
      <div className="relative mb-3 overflow-hidden rounded-2xl bg-muted dark:bg-slate-700">
        <img
          src={product.image}
          alt={product.name}
          className="h-40 w-full object-cover transition group-hover:scale-105"
        />
        <span className="absolute left-4 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800/90 dark:text-slate-300">
          <FiStar className="text-amber-400" /> {product.rating}
        </span>
      </div>

      <button onClick={() => onSelect(product)} className="flex-1 text-left">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{product.weight}</p>
      </button>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(product.price)}</p>
          <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Delivery in 15 min</p>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 dark:bg-primary-light dark:hover:bg-primary-light/90"
        >
          <FiPlus className="inline" /> Add
        </button>
      </div>
    </div>
  )
}

export default ProductCard
