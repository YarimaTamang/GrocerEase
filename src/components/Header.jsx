import { Link, NavLink } from 'react-router-dom'
import { FiShoppingBag, FiUser, FiLogOut, FiSettings, FiMoon, FiSun } from 'react-icons/fi'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

const navItems = [
  { to: '/', label: 'Home' },
]

const Header = () => {
  const { cart, totals } = useCart()
  const { user, logout } = useAuth()
  const { isDark, toggleDarkMode } = useTheme()
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <FiShoppingBag size={22} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-primary">GroceryEase</span>
        </Link>

        <nav className="hidden gap-6 text-sm font-medium text-slate-600 sm:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition hover:text-primary ${isActive ? 'text-primary' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {user && (
            <>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `transition hover:text-primary ${isActive ? 'text-primary' : ''}`
                }
              >
                Orders
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `transition hover:text-primary ${isActive ? 'text-primary' : ''}`
                }
              >
                Profile
              </NavLink>
              {user.isOwner && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-1 transition hover:text-primary ${isActive ? 'text-primary' : ''}`
                  }
                >
                  <FiSettings className="w-4 h-4" />
                  Admin
                </NavLink>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-primary/40 dark:bg-slate-800 dark:text-slate-100"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <FiSun className="w-4 h-4 text-amber-400" /> : <FiMoon className="w-4 h-4" />}
          </button>
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-red-300 hover:text-red-600"
                title="Logout"
              >
                <FiLogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </>
          )}
          <Link
            to={user ? "/cart" : "/login"}
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-primary/40"
          >
            <div className="relative">
              <FiShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-accent px-1 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </div>
            <div className="hidden flex-col leading-4 sm:flex">
              <span className="text-xs text-slate-500">Cart</span>
              <span>{totals.subtotal ? `₹${totals.subtotal}` : '₹0'}</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
