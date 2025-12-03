import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiPackage, FiPlus, FiArrowLeft, FiImage, FiDollarSign, FiGrid, FiTag, FiFileText, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/api.js'

const Admin = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: 'vegetables',
    weight: '',
    stock: '',
    tags: '',
    description: '',
    nutrition: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState(null)

  // Redirect if not owner
  useEffect(() => {
    if (!user?.isOwner) {
      navigate('/')
    } else {
      loadProducts()
    }
  }, [user, navigate])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await fetchProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'dairy', label: 'Dairy & Eggs' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'meat', label: 'Meat & Fish' },
    { value: 'cereals', label: 'Cereals & Grains' },
    { value: 'spices', label: 'Spices & Condiments' },
    { value: 'packed food', label: 'Packed Food' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'personal care', label: 'Personal Care' },
    { value: 'misc', label: 'Miscellaneous' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Handle image preview
    if (name === 'image' && value) {
      setPreviewImage(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Name, price, and category are required')
      return
    }

    setLoading(true)

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || `https://picsum.photos/seed/${formData.name.replace(/\s+/g, '-')}/300/200.jpg`,
        weight: formData.weight || '1 kg',
        rating: 4.5,
        stock: parseInt(formData.stock) || 100,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : ['new'],
        description: formData.description || `Fresh ${formData.name} from our store`,
        nutrition: formData.nutrition || 'High quality product',
        addedBy: user.id || 'admin',
        addedAt: new Date().toISOString()
      }

      if (editingId) {
        // Update existing product
        await updateProduct(editingId, productData)
        toast.success('Product updated successfully!')
        setEditingId(null)
      } else {
        // Create new product
        await createProduct(productData)
        toast.success('Product added successfully!')
      }
      
      // Reset form and reload products
      setFormData({
        name: '',
        price: '',
        image: '',
        category: 'vegetables',
        weight: '',
        stock: '',
        tags: '',
        description: '',
        nutrition: ''
      })
      setPreviewImage('')
      
      // Reload products list
      await loadProducts()

    } catch (error) {
      console.error('Error saving product:', error)
      toast.error(error.response?.data?.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white shadow-sm border-b dark:bg-slate-800 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-slate-100"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back to Store</span>
              </button>
              <div className="ml-8 flex items-center gap-2">
                <FiPackage className="w-6 h-6 text-primary dark:text-primary-light" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-300">Welcome, {user?.name}</span>
              <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full dark:bg-primary-light/20 dark:text-primary-light">
                OWNER
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 dark:bg-slate-800 dark:shadow-slate-700">
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 dark:text-slate-100">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              {editingId 
                ? 'Update the product details below' 
                : 'Fill in the details below to add a new product to the store'}
            </p>
          </div>

          {/* Product Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                  <FiTag className="inline w-4 h-4 mr-1" />
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:ring-primary-light/50 dark:focus:border-primary-light"
                  placeholder="e.g., Fresh Tomatoes"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                  <FiDollarSign className="inline w-4 h-4 mr-1" />
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:ring-primary-light/50 dark:focus:border-primary-light"
                  placeholder="e.g., 4.99"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                  <FiGrid className="inline w-4 h-4 mr-1" />
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:ring-primary-light/50 dark:focus:border-primary-light"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                  Weight/Quantity
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:ring-primary-light/50 dark:focus:border-primary-light"
                  placeholder="e.g., 1 kg, 500 g, 1 L"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:ring-primary-light/50 dark:focus:border-primary-light"
                  placeholder="e.g., 100"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                  <FiImage className="inline w-4 h-4 mr-1" />
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:ring-primary-light/50 dark:focus:border-primary-light"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:ring-primary-light/50 dark:focus:border-primary-light"
                placeholder="e.g., fresh, organic, premium"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                <FiFileText className="inline w-4 h-4 mr-1" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:ring-primary-light/50 dark:focus:border-primary-light"
                placeholder="Describe the product..."
              />
            </div>

            {/* Nutrition */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
                Nutrition Information
              </label>
              <textarea
                name="nutrition"
                value={formData.nutrition}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:ring-primary-light/50 dark:focus:border-primary-light"
                placeholder="e.g., Calories: 50 kcal, Vitamin C: 20 mg"
              />
            </div>

            {/* Image Preview */}
            {previewImage && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Image Preview
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                  <img
                    src={previewImage}
                    alt="Product preview"
                    className="w-32 h-32 object-cover rounded-lg mx-auto"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/seed/fallback/300/200.jpg`
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  'Saving...'
                ) : (
                  <>
                    <FiPlus className="w-4 h-4" />
                    {editingId ? 'Update Product' : 'Add Product'}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Products List */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 dark:text-slate-200">
              Manage Products ({products.length})
            </h3>
            
            {loading && products.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-lg dark:bg-slate-700/30">
                <FiPackage className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-200">No products</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Get started by adding a new product.
                </p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md dark:bg-slate-800">
                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                  {products.map((product) => (
                    <li key={product.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            className="h-16 w-16 rounded-md object-cover" 
                            src={product.image} 
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80?text=No+Image'
                            }}
                          />
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-200">
                              {product.name}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              ${product.price.toFixed(2)} • {product.category}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Stock: {product.stock} • Added: {new Date(product.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            disabled={loading}
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            disabled={loading}
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
