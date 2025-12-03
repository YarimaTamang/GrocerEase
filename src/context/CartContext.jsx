import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import {
  computeTotals,
  loadCartFromStorage,
  saveCartToStorage,
} from '../utils/helpers'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => loadCartFromStorage())
  const totals = useMemo(() => computeTotals(cart), [cart])

  useEffect(() => {
    saveCartToStorage(cart)
  }, [cart])

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const index = prev.findIndex((item) => item.id === product.id)
      if (index >= 0) {
        const updated = [...prev]
        updated[index] = { ...updated[index], quantity: updated[index].quantity + qty }
        toast.success('Updated quantity in cart')
        return updated
      }
      toast.success('Added to cart')
      return [...prev, { ...product, quantity: qty }]
    })
  }

  const updateQuantity = (productId, newQty) => {
    setCart((prev) => {
      if (newQty <= 0) return prev.filter((item) => item.id !== productId)
      return prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item,
      )
    })
  }

  const removeItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
    toast.info('Removed from cart')
  }

  const clearCart = () => setCart([])

  const restoreCart = (items) => {
    setCart(items)
    toast.success('Cart restored')
  }

  const value = {
    cart,
    totals,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    restoreCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
