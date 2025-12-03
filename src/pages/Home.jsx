import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiZap, FiGift } from 'react-icons/fi'
import SearchBar from '../components/SearchBar.jsx'
import Filters from '../components/Filters.jsx'
import ProductList from '../components/ProductList.jsx'
import Modal from '../components/Modal.jsx'
import { fetchProducts } from '../api/api.js'
import { formatCurrency } from '../utils/helpers.js'
import { useCart } from '../context/CartContext.jsx'

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('rating_desc')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const fetched = await fetchProducts()
        setProducts(fetched)
      } catch (err) {
        console.error('Error loading products:', err)
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let list = [...products]

    // category filter
    if (category !== 'all') {
      list = list.filter((p) => p.category?.toLowerCase() === category)
    }

    // search filter
    const term = search.trim().toLowerCase()
    if (term) {
      list = list.filter((p) => {
        const name = p.name?.toLowerCase() || ''
        const desc = p.description?.toLowerCase() || ''
        const cat = p.category?.toLowerCase() || ''
        return name.includes(term) || desc.includes(term) || cat.includes(term)
      })
    }

    // sorting
    switch (sort) {
      case 'price_asc':
        list.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price_desc':
        list.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'rating_desc':
      default:
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
    }

    return list
  }, [products, search, category, sort])

  return (
    <section className="space-y-8">
      {/* Hero Banner */}
      <div
        className="banner rounded-3xl px-6 py-10 text-white shadow-card"
        style={{ minHeight: '300px', background: 'radial-gradient(circle at top, #2e7d32, #0f5132)' }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">15 MIN DELIVERY</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
              Hyperlocal groceries, curated for your kitchen
            </h1>
            <p className="mt-3 max-w-xl text-white/80">
              Discover smart combos, daily deals, and chef picks delivered lightning fast.
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <div className="rounded-2xl bg-white/15 px-4 py-3">
              <p className="text-xs text-white/70">Average delivery</p>
              <p className="text-2xl font-semibold">12 min</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-3">
              <p className="text-xs text-white/70">Orders today</p>
              <p className="text-2xl font-semibold">1.4k+</p>
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
          <button
            onClick={() => setCategory('fruits')}
            className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 text-left font-semibold"
          >
            <FiZap className="text-2xl" /> Fresh fruits daily harvest
          </button>
          <button
            onClick={() => setCategory('vegetables')}
            className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 text-left font-semibold"
          >
            <FiGift className="text-2xl" /> Veggies curated by chefs
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {['fruits', 'vegetables', 'dairy', 'cereals'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-3xl border px-4 py-3 text-left text-sm font-semibold capitalize transition bg-white ${
              category === cat 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            Trending in {cat}
            <p className="text-xs font-normal text-slate-500">Best sellers & combos</p>
          </button>
        ))}
      </div>

      <SearchBar value={search} onChange={setSearch} />
      <Filters
        selectedCategory={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
      />

      <ProductList
        products={filteredProducts}
        loading={loading}
        onSelect={setSelectedProduct}
        searchQuery={search}
      />

      <Modal open={Boolean(selectedProduct)} onClose={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <div className="space-y-4 bg-white">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="h-56 w-full rounded-3xl object-cover"
            />
            <div>
              <p className="text-xs uppercase text-slate-400">{selectedProduct.category}</p>
              <h2 className="text-2xl font-semibold text-slate-900">
                {selectedProduct.name}
              </h2>
              <p className="text-sm text-slate-500">{selectedProduct.weight}</p>
            </div>
            <p className="text-sm text-slate-600">{selectedProduct.description}</p>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              <p className="font-semibold text-slate-700">Nutrition</p>
              <p>{selectedProduct.nutrition}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(selectedProduct.price)}
              </p>
              <button
                onClick={() => {
                  addToCart(selectedProduct)
                  setSelectedProduct(null)
                }}
                className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white"
              >
                Add to Cart
              </button>
            </div>
            <Link
              to={`/product/${selectedProduct.id}`}
              className="block text-center text-sm font-semibold text-primary"
            >
              View full details
            </Link>
          </div>
        )}
      </Modal>
    </section>
  )
}

export default Home
