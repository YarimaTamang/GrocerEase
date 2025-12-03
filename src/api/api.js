import axios from 'axios'
import dataService from './dataService.js'

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Fallback to dataService if server is not available
const useFallback = async (serverFunction, fallbackFunction) => {
  try {
    const result = await serverFunction()
    return result
  } catch (error) {
    console.warn('Server unavailable, using fallback data:', error.message)
    return await fallbackFunction()
  }
}

export const fetchProducts = async (params = {}) => {
  try {
    console.log('Fetching products from server...')
    const response = await api.get('/products/', { params })
    console.log('Server response:', response.data)
    
    // Handle both { products: [...] } and [...] response formats
    if (response.data && response.data.products) {
      return response.data.products
    }
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.warn('Server fetch failed, using dataService fallback...')
    return await useFallback(
      () => { throw new Error('Server unavailable') },
      () => dataService.getProducts()
    )
  }
}

export const fetchProduct = async (id) => {
  return await useFallback(
    async () => {
      const { data } = await api.get(`/products/${id}`)
      return data
    },
    () => dataService.getProduct(id)
  )
}

export const createProduct = async (productData) => {
  try {
    const { data } = await api.post('/products', productData)
    return data
  } catch (error) {
    console.warn('Server create failed, using dataService fallback...')
    return await dataService.addProduct(productData)
  }
}

export const updateProduct = async (id, productData) => {
  try {
    const { data } = await api.put(`/products/${id}`, productData)
    return data
  } catch (error) {
    console.warn('Server update failed, using dataService fallback...')
    return await dataService.updateProduct(id, productData)
  }
}

export const deleteProduct = async (id) => {
  try {
    await api.delete(`/products/${id}`)
    return true
  } catch (error) {
    console.warn('Server delete failed, using dataService fallback...')
    return await dataService.deleteProduct(id)
  }
}

export const placeOrder = async (payload) => {
  try {
    const { data } = await api.post('/orders', payload)
    return data
  } catch (error) {
    console.warn('Server order failed, using dataService fallback...')
    return await dataService.addOrder(payload)
  }
}

export const fetchOrders = async () => {
  try {
    const { data } = await api.get('/orders?_sort=createdAt&_order=desc')
    return data
  } catch (error) {
    console.warn('Server orders failed, using dataService fallback...')
    return await dataService.getOrders()
  }
}

export const fetchSavedCarts = async (userId = 1) => {
  try {
    const { data } = await api.get('/savedCarts', {
      params: { userId, _sort: 'savedAt', _order: 'desc' },
    })
    return data
  } catch (error) {
    console.warn('Server saved carts failed, using localStorage fallback...')
    return [] // Fallback to empty array
  }
}

export const createSavedCart = async (payload) => {
  try {
    const { data } = await api.post('/savedCarts', payload)
    return data
  } catch (error) {
    console.warn('Server saved cart failed, using localStorage fallback...')
    return null // Fallback to null
  }
}

export const updateSavedCart = async (id, payload) => {
  try {
    const { data } = await api.put(`/savedCarts/${id}`, payload)
    return data
  } catch (error) {
    console.warn('Server saved cart update failed, using localStorage fallback...')
    return null // Fallback to null
  }
}

export const deleteSavedCart = async (id) => {
  try {
    const { data } = await api.delete(`/savedCarts/${id}`)
    return data
  } catch (error) {
    console.warn('Server saved cart delete failed, using localStorage fallback...')
    return null // Fallback to null
  }
}

// New functions for data management
export const refreshData = async () => {
  return await dataService.refreshData()
}

export const getDataStats = async () => {
  return await dataService.getStats()
}

export const exportData = async () => {
  return await dataService.exportData()
}

export const importData = async (data) => {
  return await dataService.importData(data)
}

export default api
