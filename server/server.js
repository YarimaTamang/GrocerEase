const jsonServer = require('json-server')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const { initializeDatabase } = require('./initDB')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()
const customMiddleware = require('./config/middleware')

const PORT = 3001

// Initialize database on server startup if needed
const ensureDatabaseExists = async () => {
  const dbPath = path.join(__dirname, 'db.json')
  
  // Check if database exists and has products
  if (fs.existsSync(dbPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
      if (data.products && data.products.length > 0) {
        console.log(`📚 Found existing database with ${data.products.length} products`)
        return
      }
    } catch (error) {
      console.log('⚠️  Database file corrupted, will reinitialize')
    }
  }
  
  // Initialize database from external APIs
  console.log('🔄 Initializing database from external APIs...')
  await initializeDatabase()
}

// Middleware
server.use(cors())
server.use(middlewares)
server.use(jsonServer.bodyParser)

// Add custom routes before JSON Server router
server.use(customMiddleware)

// Add custom route to refresh data
server.post('/api/refresh', async (req, res) => {
  try {
    console.log('🔄 Manual data refresh requested...')
    const result = await initializeDatabase()
    res.json({ 
      success: true, 
      message: 'Database refreshed successfully',
      productsCount: result.products.length 
    })
  } catch (error) {
    console.error('❌ Refresh failed:', error.message)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to refresh database',
      error: error.message 
    })
  }
})

// Add custom route to get database stats
server.get('/api/stats', (req, res) => {
  try {
    const dbPath = path.join(__dirname, 'db.json')
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
    
    const stats = {
      totalProducts: data.products?.length || 0,
      totalOrders: data.orders?.length || 0,
      totalUsers: data.users?.length || 0,
      categories: [...new Set(data.products?.map(p => p.category) || [])],
      lastUpdated: fs.statSync(dbPath).mtime
    }
    
    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

// Use default router
server.use(router)

// Start server
server.listen(PORT, async () => {
  console.log(`🚀 JSON Server is running on http://localhost:${PORT}`)
  
  // Ensure database exists and is populated
  await ensureDatabaseExists()
  
  console.log('✅ Server ready to serve requests!')
})
