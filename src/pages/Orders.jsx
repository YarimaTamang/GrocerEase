import { useEffect, useState } from 'react'
import { FiPackage, FiClock, FiUser, FiMapPin, FiPhone, FiCreditCard } from 'react-icons/fi'
import { fetchOrders } from '../api/api.js'
import { formatCurrency } from '../utils/helpers.js'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-card dark:bg-slate-900 dark:border dark:border-slate-700">
        <div className="h-5 w-1/4 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 h-24 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-card dark:bg-slate-900 dark:border dark:border-slate-700">
        <FiPackage className="mx-auto mb-3 text-3xl text-slate-300" />
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">No orders yet</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Place an order and it will appear here.</p>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="space-y-4 rounded-3xl bg-white p-6 shadow-card dark:bg-slate-900 dark:border dark:border-slate-700">
          {/* Order Header */}
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <p className="text-xs uppercase text-slate-400">Order ID</p>
              <h3 className="text-lg font-semibold text-slate-900">#{order.id}</h3>
              <p className="text-xs text-slate-500">
                {new Date(order.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              <FiClock /> {order.status}
            </span>
          </div>

          {/* Customer Details */}
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <FiUser className="text-primary" />
              <h4 className="text-sm font-semibold text-slate-900">Customer Details</h4>
            </div>
            <div className="grid gap-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <FiUser className="w-4 h-4 text-slate-400" />
                <span className="font-medium">{order.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="w-4 h-4 text-slate-400" />
                <span>{order.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <FiMapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <span className="text-slate-600">{order.address}</span>
              </div>
              {order.instructions && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <p className="text-xs text-slate-500">Delivery Instructions:</p>
                  <p className="text-sm text-slate-600">{order.instructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Order Items</h4>
            <div className="space-y-2">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.category} • {item.weight}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Total */}
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <FiCreditCard className="text-primary" />
              <h4 className="text-sm font-semibold text-slate-900">Payment Details</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Payment Method:</span>
                <span className="font-medium capitalize">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                   order.paymentMethod === 'card' ? 'Credit/Debit Card' : 
                   order.paymentMethod === 'upi' ? 'UPI Payment' : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.totals?.subtotal ?? 0)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery:</span>
                <span>{order.totals?.delivery === 0 ? 'Free' : formatCurrency(order.totals?.delivery ?? 0)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-semibold text-slate-900">
                <span>Total Paid:</span>
                <span>{formatCurrency(order.totals?.total ?? 0)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

export default Orders
