const STORAGE_KEY = 'grocery_cart'

export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

export const loadCartFromStorage = () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    return cached ? JSON.parse(cached) : []
  } catch (error) {
    console.error('Failed to parse cart from storage', error)
    return []
  }
}

export const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('Failed to save cart to storage', error)
  }
}

export const computeTotals = (cart) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const delivery = subtotal >= 499 || subtotal === 0 ? 0 : 40
  const total = subtotal + delivery
  return { subtotal, delivery, total }
}

export const estimateDeliveryWindow = () => {
  const now = new Date()
  const eta = new Date(now.getTime() + 60 * 60 * 1000)
  return `${now.getHours() + 1}:00 - ${eta.getHours() + 1}:30` // simple mock window
}

export const debounce = (fn, delay = 300) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
