// LocalStorage utility functions for managing grocery data

const STORAGE_KEYS = {
  PRODUCTS: 'grocery_products',
  ORDERS: 'grocery_orders', 
  USERS: 'grocery_users',
  CART: 'grocery_cart',
  LAST_SYNC: 'grocery_last_sync'
}

// Generic localStorage operations
export const storage = {
  // Get item from localStorage
  get: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error)
      return null
    }
  },

  // Set item to localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error setting ${key} to localStorage:`, error)
      return false
    }
  },

  // Remove item from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
      return false
    }
  },

  // Clear all grocery data
  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}

// Product-specific operations
export const productStorage = {
  // Get all products
  getProducts: () => storage.get(STORAGE_KEYS.PRODUCTS) || [],

  // Set products
  setProducts: (products) => storage.set(STORAGE_KEYS.PRODUCTS, products),

  // Get single product by ID
  getProduct: (id) => {
    const products = productStorage.getProducts()
    return products.find(p => p.id === id) || null
  },

  // Add or update product
  saveProduct: (product) => {
    const products = productStorage.getProducts()
    const index = products.findIndex(p => p.id === product.id)
    
    if (index >= 0) {
      products[index] = product
    } else {
      products.push(product)
    }
    
    return productStorage.setProducts(products)
  },

  // Delete product
  deleteProduct: (id) => {
    const products = productStorage.getProducts()
    const filteredProducts = products.filter(p => p.id !== id)
    return productStorage.setProducts(filteredProducts)
  }
}

// Order-specific operations
export const orderStorage = {
  // Get all orders
  getOrders: () => storage.get(STORAGE_KEYS.ORDERS) || [],

  // Set orders
  setOrders: (orders) => storage.set(STORAGE_KEYS.ORDERS, orders),

  // Get single order by ID
  getOrder: (id) => {
    const orders = orderStorage.getOrders()
    return orders.find(o => o.id === id) || null
  },

  // Add new order
  addOrder: (order) => {
    const orders = orderStorage.getOrders()
    orders.push(order)
    return orderStorage.setOrders(orders)
  },

  // Update order status
  updateOrderStatus: (id, status) => {
    const orders = orderStorage.getOrders()
    const index = orders.findIndex(o => o.id === id)
    
    if (index >= 0) {
      orders[index].status = status
      return orderStorage.setOrders(orders)
    }
    
    return false
  }
}

// User-specific operations
export const userStorage = {
  // Get all users
  getUsers: () => storage.get(STORAGE_KEYS.USERS) || [],

  // Set users
  setUsers: (users) => storage.set(STORAGE_KEYS.USERS, users),

  // Get user by email
  getUser: (email) => {
    const users = userStorage.getUsers()
    return users.find(u => u.email === email) || null
  },

  // Add new user
  addUser: (user) => {
    const users = userStorage.getUsers()
    users.push(user)
    return userStorage.setUsers(users)
  },

  // Update user
  updateUser: (email, userData) => {
    const users = userStorage.getUsers()
    const index = users.findIndex(u => u.email === email)
    
    if (index >= 0) {
      users[index] = { ...users[index], ...userData }
      return userStorage.setUsers(users)
    }
    
    return false
  }
}

// Cart-specific operations
export const cartStorage = {
  // Get cart items
  getCart: () => storage.get(STORAGE_KEYS.CART) || [],

  // Set cart items
  setCart: (cart) => storage.set(STORAGE_KEYS.CART, cart),

  // Add item to cart
  addToCart: (product, quantity = 1) => {
    const cart = cartStorage.getCart()
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ ...product, quantity })
    }
    
    return cartStorage.setCart(cart)
  },

  // Update cart item quantity
  updateQuantity: (productId, quantity) => {
    const cart = cartStorage.getCart()
    const item = cart.find(item => item.id === productId)
    
    if (item) {
      if (quantity <= 0) {
        return cartStorage.removeFromCart(productId)
      }
      item.quantity = quantity
      return cartStorage.setCart(cart)
    }
    
    return false
  },

  // Remove item from cart
  removeFromCart: (productId) => {
    const cart = cartStorage.getCart()
    const filteredCart = cart.filter(item => item.id !== productId)
    return cartStorage.setCart(filteredCart)
  },

  // Clear cart
  clearCart: () => cartStorage.setCart([])
}

// Sync management
export const syncStorage = {
  // Get last sync time
  getLastSync: () => storage.get(STORAGE_KEYS.LAST_SYNC),

  // Set last sync time
  setLastSync: () => storage.set(STORAGE_KEYS.LAST_SYNC, new Date().toISOString()),

  // Check if sync is needed (older than specified hours)
  needsSync: (hours = 24) => {
    const lastSync = syncStorage.getLastSync()
    if (!lastSync) return true
    
    const syncTime = new Date(lastSync)
    const now = new Date()
    const diffHours = (now - syncTime) / (1000 * 60 * 60)
    
    return diffHours > hours
  }
}

// Export all storage utilities
export default {
  storage,
  productStorage,
  orderStorage,
  userStorage,
  cartStorage,
  syncStorage,
  STORAGE_KEYS
}
