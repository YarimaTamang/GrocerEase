import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiCreditCard, FiSmartphone, FiMapPin, FiPlus, FiEdit2, FiUser } from 'react-icons/fi'
import { useCart } from '../context/CartContext.jsx'
import { placeOrder } from '../api/api.js'
import { formatCurrency } from '../utils/helpers.js'
import { useAuth } from '../context/AuthContext.jsx'

const initialForm = {
  name: '',
  phone: '',
  address: '',
  instructions: '',
}

const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', icon: FiSmartphone, description: 'Pay when you receive' },
  { id: 'card', name: 'Credit/Debit Card', icon: FiCreditCard, description: 'Visa, Mastercard, Rupay' },
  { id: 'upi', name: 'UPI Payment', icon: FiSmartphone, description: 'PhonePe, GPay, Paytm' },
]

const Checkout = () => {
  const { cart, totals, clearCart } = useCart()
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [selectedPayment, setSelectedPayment] = useState('cod')
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Load saved addresses from localStorage on component mount
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const savedAddresses = localStorage.getItem(`addresses_${user?.id || 'guest'}`)
    return savedAddresses ? JSON.parse(savedAddresses) : []
  })

  // Update saved addresses when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedAddresses = localStorage.getItem(`addresses_${user?.id || 'guest'}`)
      if (savedAddresses) {
        setSavedAddresses(JSON.parse(savedAddresses))
      }
    }
    
    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically for local changes
    const interval = setInterval(() => {
      handleStorageChange()
    }, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [user?.id])

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
      }))
    }
  }, [user])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address)
    setForm(prev => ({ ...prev, address: address.detail }))
    setUseNewAddress(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!cart.length) {
      toast.info('Add items to cart before checking out')
      return
    }

    if (!selectedAddress && !form.address) {
      toast.error('Please select or enter a delivery address')
      return
    }

    setLoading(true)
    try {
      await placeOrder({
        ...form,
        items: cart,
        totals,
        paymentMethod: selectedPayment,
        address: selectedAddress?.detail || form.address,
        createdAt: new Date().toISOString(),
        status: 'placed',
      })
      toast.success('Order placed successfully')
      clearCart()
      setForm(initialForm)
      setSelectedAddress(null)
      setSelectedPayment('cod')
      navigate('/orders')
    } catch (error) {
      console.error(error)
      toast.error('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-6 shadow-card dark:bg-slate-900 dark:border dark:border-slate-700">
        {/* Delivery Address Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FiMapPin className="text-primary" />
            <h2 className="text-xl font-semibold text-slate-900">Delivery Address</h2>
          </div>
          
          {/* Saved Addresses */}
          <div className="space-y-3 mb-4">
            {savedAddresses.length > 0 ? (
              <>
                <p className="text-sm text-slate-500 mb-2">Select a saved address:</p>
                {savedAddresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => handleAddressSelect(address)}
                    className={`rounded-2xl border p-4 cursor-pointer transition ${
                      selectedAddress?.id === address.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{address.label}</p>
                        <p className="text-sm text-slate-600 mt-1">{address.detail}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                          {selectedAddress?.id === address.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedAddress?.id === address.id && (
                      <div className="mt-3 pt-3 border-t border-primary/20">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          <FiMapPin className="w-3 h-3" />
                          Delivering here
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-center">
                <FiMapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No saved addresses yet</p>
                <p className="text-xs text-slate-400 mt-1">Add a new address below or save addresses in your Profile for faster checkout</p>
                <Link 
                  to="/profile" 
                  className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-primary hover:text-primary/80"
                >
                  <FiUser className="w-3 h-3" />
                  Go to Profile to add addresses
                </Link>
              </div>
            )}
            
            {/* Add New Address */}
            <div
              onClick={() => {
                setUseNewAddress(true)
                setSelectedAddress(null)
              }}
              className={`rounded-2xl border p-4 cursor-pointer transition ${
                useNewAddress
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-dashed border-slate-300 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <FiPlus />
                <span>Add New Address</span>
              </div>
            </div>
          </div>

          {/* New Address Form */}
          {useNewAddress && (
            <div className="space-y-4 p-4 border border-slate-200 rounded-2xl bg-slate-50">
              <label className="block text-sm font-medium text-slate-600">
                Full Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none bg-white"
                  placeholder="John Doe"
                />
              </label>

              <label className="block text-sm font-medium text-slate-600">
                Phone Number
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none bg-white"
                  placeholder="9876543210"
                />
              </label>

              <label className="block text-sm font-medium text-slate-600">
                Complete Address
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none bg-white"
                  placeholder="Apartment, Street, Landmark"
                />
              </label>

              <label className="block text-sm font-medium text-slate-600">
                Delivery Instructions (optional)
                <textarea
                  name="instructions"
                  value={form.instructions}
                  onChange={handleChange}
                  rows="2"
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none bg-white"
                  placeholder="Leave at the door"
                />
              </label>
            </div>
          )}
        </div>

        {/* Payment Method Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FiCreditCard className="text-primary" />
            <h2 className="text-xl font-semibold text-slate-900">Payment Method</h2>
          </div>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`rounded-2xl border p-4 cursor-pointer transition ${
                    selectedPayment === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="text-xl text-slate-600" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{method.name}</p>
                        <p className="text-xs text-slate-500">{method.description}</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                      {selectedPayment === method.id && (
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Placing order...' : `Place Order (${formatCurrency(totals.total)})`}
        </button>
      </form>

      <div className="space-y-4 rounded-3xl bg-white p-6 shadow-card dark:bg-slate-900 dark:border dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Order Summary</h2>
        
        {/* Delivery Address Summary */}
        {(selectedAddress || form.address) && (
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <FiMapPin className="text-primary" />
              <p className="text-sm font-semibold text-slate-900">Delivering to</p>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {selectedAddress ? `${selectedAddress.label}: ${selectedAddress.detail}` : form.address}
            </p>
          </div>
        )}

        {/* Payment Method Summary */}
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <FiCreditCard className="text-primary" />
            <p className="text-sm font-semibold text-slate-900">Payment Method</p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {paymentMethods.find(m => m.id === selectedPayment)?.name}
          </p>
        </div>

        {cart.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Your cart is empty.</p>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-slate-100 pt-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{totals.delivery === 0 ? 'Free' : formatCurrency(totals.delivery)}</span>
          </div>
          <div className="mt-3 flex justify-between text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Checkout
