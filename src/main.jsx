import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import App from './App.jsx'
import './styles/index.css'
import 'react-toastify/dist/ReactToastify.css'
import { CartProvider } from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CartProvider>
      <App />
      <ToastContainer position="top-center" autoClose={2000} theme="light" />
    </CartProvider>
  </BrowserRouter>
)
