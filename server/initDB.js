const fs = require('fs')
const path = require('path')
const axios = require('axios')

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

// Initialize database with external API data
const initializeDatabase = async () => {
  try {
    console.log('🚀 Initializing grocery database from external APIs...')
    
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
    
    console.log('📡 Fetching data from multiple API endpoints...')
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
        console.log(`❌ Failed to fetch from API ${index}: ${response.reason?.message || 'Unknown error'}`)
      }
    })
    
    // Remove duplicates based on name
    const uniqueProducts = allProducts.filter((product, index, self) =>
      index === self.findIndex((p) => p.name.toLowerCase() === product.name.toLowerCase())
    )
    
    console.log(`📦 Total unique products: ${uniqueProducts.length}`)
    
    // Load existing data
    const dbPath = path.join(__dirname, 'db.json')
    let existingData = { products: [], orders: [], users: [] }
    
    if (fs.existsSync(dbPath)) {
      try {
        const existingContent = fs.readFileSync(dbPath, 'utf8')
        existingData = JSON.parse(existingContent)
        console.log(`📚 Loaded existing data: ${existingData.products.length} products, ${existingData.orders.length} orders`)
      } catch (error) {
        console.log('⚠️  Could not parse existing db.json, starting fresh')
      }
    }
    
    // Merge with existing data, preserving existing products
    const existingNames = new Set(existingData.products.map(p => p.name.toLowerCase()))
    const newProducts = uniqueProducts.filter(p => !existingNames.has(p.name.toLowerCase()))
    
    console.log(`🆔 New products to add: ${newProducts.length}`)
    
    // Combine products
    const combinedProducts = [...existingData.products, ...newProducts]
    
    // Create final database
    const dbData = {
      products: combinedProducts,
      orders: existingData.orders,
      users: existingData.users
    }
    
    // Write to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2))
    
    console.log(`✅ Database initialized successfully!`)
    console.log(`📊 Total products: ${dbData.products.length}`)
    console.log(`📦 Categories: ${[...new Set(dbData.products.map(p => p.category))].join(', ')}`)
    console.log(`💾 Saved to: ${dbPath}`)
    
    return dbData
    
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Database initialization complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Initialization failed:', error)
      process.exit(1)
    })
}

module.exports = { initializeDatabase }
