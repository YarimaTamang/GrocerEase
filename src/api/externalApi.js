import axios from 'axios'

// External API service for fetching initial data
export const fetchExternalProducts = async () => {
  try {
    console.log('Fetching products from external API...')
    
    // Using Open Food Facts API (free, no API key required)
    const response = await axios.get('https://world.openfoodfacts.org/api/v2/search?categories=en:groceries&page_size=20&fields=product_name,code,image_url,nutriments,categories_tags')
    
    if (response.data && response.data.products) {
      const products = response.data.products.map((product, index) => ({
        id: (index + 1).toString(),
        name: product.product_name || `Product ${index + 1}`,
        price: Math.floor(Math.random() * 500) + 50, // Random price for demo
        category: mapCategory(product.categories_tags?.[0] || 'misc'),
        image: product.image_url || `https://picsum.photos/seed/product${index}/300/200.jpg`,
        weight: '1 kg',
        rating: (Math.random() * 2 + 3).toFixed(1), // Random rating 3-5
        stock: Math.floor(Math.random() * 200) + 50,
        tags: product.categories_tags?.slice(0, 3) || ['grocery'],
        description: `Imported from Open Food Facts: ${product.product_name}`,
        nutrition: product.nutriments ? 
          `Calories: ${product.nutriments['energy-kcal_100g'] || 'N/A'} kcal per 100g` : 
          'Nutrition information not available',
        source: 'external_api',
        importedAt: new Date().toISOString()
      }))
      
      console.log(`Fetched ${products.length} products from external API`)
      return products
    }
    return []
  } catch (error) {
    console.error('Error fetching external products:', error)
    return []
  }
}

// Helper function to map categories
const mapCategory = (category) => {
  const categoryMap = {
    'en:fruits': 'fruits',
    'en:vegetables': 'vegetables', 
    'en:dairy': 'dairy',
    'en:bakery': 'bakery',
    'en:beverages': 'beverages',
    'en:snacks': 'snacks',
    'en:cereals': 'cereals'
  }
  
  for (const [key, value] of Object.entries(categoryMap)) {
    if (category?.includes(key)) return value
  }
  return 'misc'
}
