import { FiTrash2 } from 'react-icons/fi'
import QuantityPicker from './QuantityPicker.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatCurrency } from '../utils/helpers.js'

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-600 dark:bg-slate-800">
      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
      <div className="flex-1">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{item.weight}</p>
        <div className="mt-2 flex items-center gap-3">
          <QuantityPicker value={item.quantity} onChange={(qty) => updateQuantity(item.id, qty)} />
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      </div>
      <button
        onClick={() => removeItem(item.id)}
        className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-rose-100 hover:text-rose-500 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
        aria-label={`Remove ${item.name}`}
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  )
}

export default CartItem
