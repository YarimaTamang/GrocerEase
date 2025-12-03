import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiTruck, FiStar } from 'react-icons/fi'
import { fetchProduct } from '../api/api.js'
import { formatCurrency } from '../utils/helpers.js'
import { useCart } from '../context/CartContext.jsx'

const ProductPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    setLoading(true)
    fetchProduct(id)
      .then(setProduct)
      .catch(() => toast.error('Unable to load product'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-card">
        <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />
        <div className="mt-6 h-6 w-1/3 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
        Product not found.
      </div>
    )
  }

  return (
    <section className="grid gap-8 md:grid-cols-2">
      <img
        src={product.image}
        alt={product.name}
        className="h-full max-h-[480px] w-full rounded-3xl object-cover shadow-card"
      />

      <div className="space-y-5 rounded-3xl bg-white p-6 shadow-card">
        <p className="text-xs uppercase text-slate-400">{product.category}</p>
        <h1 className="text-3xl font-semibold text-slate-900">{product.name}</h1>
        <p className="text-sm text-slate-500">{product.weight}</p>

        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <FiStar className="text-amber-400" /> {product.rating}
          </span>
          <span>Stock: {product.stock}</span>
        </div>

        <p className="text-base text-slate-600">{product.description}</p>

        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Nutrition facts</p>
          <p>{product.nutrition}</p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-3 text-primary">
          <FiTruck />
          <span>Delivered in 15 minutes within your area</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase text-slate-400">Price</p>
            <p className="text-3xl font-bold text-slate-900">
              {formatCurrency(product.price)}
            </p>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="rounded-full bg-primary px-8 py-3 text-base font-semibold text-white"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductPage
