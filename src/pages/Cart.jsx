import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatCurrency } from '../utils/helpers.js'

const Cart = () => {
  const { cart, totals, clearCart } = useCart()

  if (!cart.length) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-card dark:bg-slate-900 dark:border dark:border-slate-700">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">Your cart is empty</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add items to see them listed here.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white dark:bg-primary-light"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <aside className="space-y-4 rounded-3xl bg-white p-6 shadow-card dark:bg-slate-900 dark:border dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Bill Details</h2>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{totals.delivery === 0 ? 'Free' : formatCurrency(totals.delivery)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-slate-900 dark:text-slate-100">
            <span>Total</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/checkout"
            className="block rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white dark:bg-primary-light"
          >
            Proceed to Checkout
          </Link>
          <button
            onClick={clearCart}
            className="w-full rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-600 dark:border-slate-600 dark:text-slate-300"
          >
            Clear Cart
          </button>
        </div>
      </aside>
    </section>
  )
}

export default Cart
