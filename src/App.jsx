import { Route, Routes, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import ProductPage from './pages/ProductPage.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders from './pages/Orders.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Admin from './pages/Admin.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" replace />
}

const OwnerRoute = ({ children }) => {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return user?.isOwner ? children : <Navigate to="/" replace />
}

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header />
      <main className="flex-grow mx-auto max-w-6xl px-4 pb-12 pt-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<OwnerRoute><Admin /></OwnerRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
