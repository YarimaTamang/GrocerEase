import axios from 'axios'
import fs from 'fs'
import path from 'path'

// API endpoints for fetching grocery data
const API_ENDPOINTS = {
  GROCERY_API: 'https://world.openfoodfacts.org/api/v2/search?categories=en:groceries&page_size=50&fields=product_name,code,image_url,nutriments,categories_tags',
  FRUITS_API: 'https://world.openfoodfacts.org/api/v2/search?categories=en:fruits&page_size=20&fields=product_name,code,image_url,nutriments,categories_tags',
  VEGETABLES_API: 'https://world.openfoodfacts.org/api/v2/search?categories=en:vegetables&page_size=20&fields=product_name,code,image_url,nutriments,categories_tags',
  DAIRY_API: 'https://world.openfoodfacts.org/api/v2/search?categories=en:dairy&page_size=15&fields=product_name,code,image_url,nutriments,categories_tags',
  CEREALS_API: 'https://world.openfoodfacts.org/api/v2/search?categories=en:cereals&page_size=10&fields=product_name,code,image_url,nutriments,categories_tags'
}

// Category mapping
const CATEGORY_MAP = {
  'en:fruits': 'fruits',
  'en:vegetables': 'vegetables',
  'en:dairy': 'dairy',
  'en:bakery': 'bakery',
  'en:beverages': 'beverages',
  'en:snacks': 'snacks',
  'en:cereals': 'cereals',
  'en:spices': 'spices',
  'en:plant-based-foods': 'vegetables',
  'en:dairies': 'dairy',
  'en:fermented-foods': 'dairy',
  'en:milks': 'dairy',
  'en:cheeses': 'dairy'
}

// Helper function to map categories
const mapCategory = (category) => {
  for (const [key, value] of Object.entries(CATEGORY_MAP)) {
    if (category?.includes(key)) return value
  }
  return 'misc'
}

// Helper function to generate realistic prices
const generatePrice = (category) => {
  const basePrices = {
    fruits: 80,
    vegetables: 40,
    dairy: 90,
    cereals: 150,
    snacks: 200,
    bakery: 50,
    spices: 60,
    misc: 100
  }
  
  const base = basePrices[category] || 100
  return Math.floor(base + (Math.random() * base - base/2))
}

// Helper function to generate rating
const generateRating = () => {
  return (Math.random() * 1.5 + 3.5).toFixed(1) // Rating between 3.5 and 5.0
}

// Helper function to generate stock
const generateStock = () => {
  return Math.floor(Math.random() * 150) + 50 // Stock between 50 and 200
}

// Transform API data to our product format
const transformProduct = (product, index, category) => {
  const mappedCategory = mapCategory(product.categories_tags?.[0] || category)
  
  return {
    id: (index + 1).toString(),
    name: product.product_name || `Product ${index + 1}`,
    price: generatePrice(mappedCategory),
    category: mappedCategory,
    image: product.image_url || `https://picsum.photos/seed/product${index}/300/200.jpg`,
    weight: '1 kg',
    rating: parseFloat(generateRating()),
    stock: generateStock(),
    tags: product.categories_tags?.slice(0, 3) || ['grocery'],
    description: `High-quality ${mappedCategory} product imported from trusted sources.`,
    nutrition: product.nutriments ? 
      `Calories: ${product.nutriments['energy-kcal_100g'] || 'N/A'} kcal per 100g` : 
      'Nutrition information not available',
    source: 'external_api',
    importedAt: new Date().toISOString()
  }
}

// Fetch data from external APIs
export const fetchExternalData = async () => {
  try {
    console.log('🔄 Starting data fetch from external APIs...')
    
    const allProducts = []
    let productId = 1
    
    // Fetch data from different categories
    const apiCalls = [
      axios.get(API_ENDPOINTS.FRUITS_API),
      axios.get(API_ENDPOINTS.VEGETABLES_API),
      axios.get(API_ENDPOINTS.DAIRY_API),
      axios.get(API_ENDPOINTS.CEREALS_API),
      axios.get(API_ENDPOINTS.GROCERY_API)
    ]
    
    const responses = await Promise.allSettled(apiCalls)
    
    responses.forEach((response, index) => {
      if (response.status === 'fulfilled' && response.data?.products) {
        const categoryMap = ['fruits', 'vegetables', 'dairy', 'cereals', 'misc']
        const category = categoryMap[index] || 'misc'
        
        response.data.products.forEach((product) => {
          if (product.product_name && product.product_name.trim()) {
            allProducts.push(transformProduct(product, productId++, category))
          }
        })
        
        console.log(`✅ Fetched ${response.data.products.length} products from ${category}`)
      } else {
        console.log(`❌ Failed to fetch from API ${index}`)
      }
    })
    
    // Remove duplicates based on name
    const uniqueProducts = allProducts.filter((product, index, self) =>
      index === self.findIndex((p) => p.name.toLowerCase() === product.name.toLowerCase())
    )
    
    console.log(`📦 Total unique products fetched: ${uniqueProducts.length}`)
    return uniqueProducts
    
  } catch (error) {
    console.error('❌ Error fetching external data:', error.message)
    throw error
  }
}

// Store data to db.json file
export const storeDataToDB = async (products, orders = [], users = []) => {
  try {
    const dbData = {
      products: products,
      orders: orders,
      users: users
    }
    
    // In browser environment, we'll use localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('groceryDB', JSON.stringify(dbData))
      console.log('💾 Data stored in localStorage')
      return dbData
    }
    
    // In Node.js environment, write to file
    const dbPath = path.join(process.cwd(), 'server', 'db.json')
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2))
    console.log(`💾 Data stored to ${dbPath}`)
    
    return dbData
    
  } catch (error) {
    console.error('❌ Error storing data:', error.message)
    throw error
  }
}

// Load data from db.json or localStorage
export const loadDataFromDB = () => {
  try {
    // In browser environment, use localStorage
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('groceryDB')
      return data ? JSON.parse(data) : { products: [], orders: [], users: [] }
    }
    
    // In Node.js environment, read from file
    const dbPath = path.join(process.cwd(), 'server', 'db.json')
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8')
      return JSON.parse(data)
    }
    
    return { products: [], orders: [], users: [] }
    
  } catch (error) {
    console.error('❌ Error loading data:', error.message)
    return { products: [], orders: [], users: [] }
  }
}

// Initialize database with external data
export const initializeDatabase = async () => {
  try {
    console.log('🚀 Initializing grocery database...')
    
    // Try to load existing data first
    const existingData = loadDataFromDB()
    
    if (existingData.products.length > 0) {
      console.log(`📚 Found ${existingData.products.length} existing products`)
      return existingData
    }
    
    // Fetch new data if no existing data
    console.log('📡 Fetching fresh data from APIs...')
    const products = await fetchExternalData()
    
    // Store the data
    await storeDataToDB(products, existingData.orders, existingData.users)
    
    console.log('✅ Database initialization complete!')
    return { products, orders: existingData.orders, users: existingData.users }
    
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message)
    return { products: [], orders: [], users: [] }
  }
}

export default {
  fetchExternalData,
  storeDataToDB,
  loadDataFromDB,
  initializeDatabase
}
