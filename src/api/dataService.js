import { initializeDatabase, loadDataFromDB, storeDataToDB } from './fakeAPI.js'
import { productStorage, syncStorage } from '../utils/localStorage.js'

class DataService {
  constructor() {
    this.isInitialized = false
    this.data = { products: [], orders: [], users: [] }
  }

  // Initialize the data service
  async initialize() {
    if (this.isInitialized) return this.data

    try {
      console.log('🔄 Initializing DataService...')
      
      // Check if we need to sync data
      if (syncStorage.needsSync(24)) { // Sync if data is older than 24 hours
        console.log('📡 Data needs refresh, fetching from APIs...')
        await this.refreshData()
      } else {
        console.log('📚 Loading existing data from storage...')
        this.data = loadDataFromDB()
      }

      this.isInitialized = true
      console.log(`✅ DataService initialized with ${this.data.products.length} products`)
      return this.data

    } catch (error) {
      console.error('❌ Failed to initialize DataService:', error)
      // Fallback to localStorage data
      this.data = loadDataFromDB()
      this.isInitialized = true
      return this.data
    }
  }

  // Refresh data from external APIs
  async refreshData() {
    try {
      console.log('🔄 Refreshing data from external APIs...')
      
      // Initialize fresh data from APIs
      const freshData = await initializeDatabase()
      
      // Update local storage
      productStorage.setProducts(freshData.products)
      
      // Update last sync time
      syncStorage.setLastSync()
      
      // Update internal data
      this.data = freshData
      
      console.log('✅ Data refresh complete!')
      return freshData

    } catch (error) {
      console.error('❌ Failed to refresh data:', error)
      throw error
    }
  }

  // Get all products
  async getProducts() {
    await this.initialize()
    return this.data.products
  }

  // Get single product by ID
  async getProduct(id) {
    await this.initialize()
    return this.data.products.find(p => p.id === id) || null
  }

  // Search products
  async searchProducts(query) {
    await this.initialize()
    const searchTerm = query.toLowerCase().trim()
    
    return this.data.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm)
    )
  }

  // Get products by category
  async getProductsByCategory(category) {
    await this.initialize()
    return this.data.products.filter(product => product.category === category)
  }

  // Get all categories
  async getCategories() {
    await this.initialize()
    const categories = [...new Set(this.data.products.map(p => p.category))]
    return categories.sort()
  }

  // Add new product (for admin functionality)
  async addProduct(productData) {
    await this.initialize()
    
    const newProduct = {
      ...productData,
      id: (Math.max(...this.data.products.map(p => parseInt(p.id))) + 1).toString(),
      addedAt: new Date().toISOString()
    }
    
    this.data.products.push(newProduct)
    await this.saveData()
    
    return newProduct
  }

  // Update product
  async updateProduct(id, productData) {
    await this.initialize()
    
    const index = this.data.products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Product not found')
    
    this.data.products[index] = { ...this.data.products[index], ...productData }
    await this.saveData()
    
    return this.data.products[index]
  }

  // Delete product
  async deleteProduct(id) {
    await this.initialize()
    
    const index = this.data.products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Product not found')
    
    this.data.products.splice(index, 1)
    await this.saveData()
    
    return true
  }

  // Get all orders
  async getOrders() {
    await this.initialize()
    return this.data.orders
  }

  // Add new order
  async addOrder(orderData) {
    await this.initialize()
    
    const newOrder = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'placed'
    }
    
    this.data.orders.push(newOrder)
    await this.saveData()
    
    return newOrder
  }

  // Update order status
  async updateOrderStatus(id, status) {
    await this.initialize()
    
    const order = this.data.orders.find(o => o.id === id)
    if (!order) throw new Error('Order not found')
    
    order.status = status
    await this.saveData()
    
    return order
  }

  // Get all users
  async getUsers() {
    await this.initialize()
    return this.data.users
  }

  // Add new user
  async addUser(userData) {
    await this.initialize()
    
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    this.data.users.push(newUser)
    await this.saveData()
    
    return newUser
  }

  // Save data to storage
  async saveData() {
    try {
      // Save to localStorage
      productStorage.setProducts(this.data.products)
      
      // For server-side, also save to db.json
      if (typeof window === 'undefined') {
        await storeDataToDB(this.data.products, this.data.orders, this.data.users)
      }
      
    } catch (error) {
      console.error('❌ Failed to save data:', error)
      throw error
    }
  }

  // Get data statistics
  async getStats() {
    await this.initialize()
    
    const stats = {
      totalProducts: this.data.products.length,
      totalOrders: this.data.orders.length,
      totalUsers: this.data.users.length,
      categories: [...new Set(this.data.products.map(p => p.category))].length,
      lastSync: syncStorage.getLastSync()
    }
    
    return stats
  }

  // Export data (for backup)
  async exportData() {
    await this.initialize()
    return {
      ...this.data,
      exportedAt: new Date().toISOString()
    }
  }

  // Import data (for restore)
  async importData(importedData) {
    try {
      this.data = {
        products: importedData.products || [],
        orders: importedData.orders || [],
        users: importedData.users || []
      }
      
      await this.saveData()
      syncStorage.setLastSync()
      
      console.log('✅ Data imported successfully')
      return this.data

    } catch (error) {
      console.error('❌ Failed to import data:', error)
      throw error
    }
  }
}

// Create singleton instance
const dataService = new DataService()

export default dataService
