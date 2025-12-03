import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">GroceryEase</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Your one-stop destination for fresh groceries, organic products, and daily essentials. 
                Quality you can trust, delivered to your doorstep.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-300 hover:text-primary transition-colors text-sm">Home</Link></li>
              <li><Link to="/orders" className="text-slate-300 hover:text-primary transition-colors text-sm">My Orders</Link></li>
              <li><Link to="/profile" className="text-slate-300 hover:text-primary transition-colors text-sm">My Account</Link></li>
              <li><Link to="/cart" className="text-slate-300 hover:text-primary transition-colors text-sm">Cart</Link></li>
              <li><a href="#" className="text-slate-300 hover:text-primary transition-colors text-sm">Offers</a></li>
              <li><a href="#" className="text-slate-300 hover:text-primary transition-colors text-sm">New Arrivals</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-primary transition-colors text-sm">Fruits & Vegetables</a></li>
              <li><a href="#" className="text-slate-300 hover:text-primary transition-colors text-sm">Dairy & Bakery</a></li>
              <li><a href="#" className="text-slate-300 hover:text-primary transition-colors text-sm">Snacks & Beverages</a></li>
              <li><a href="#" className="text-slate-300 hover:text-primary transition-colors text-sm">Staples & Spices</a></li>
              <li><a href="#" className="text-slate-300 hover:text-primary transition-colors text-sm">Personal Care</a></li>
              <li><a href="#" className="text-slate-300 hover:text-primary transition-colors text-sm">Home & Kitchen</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-slate-300 text-sm">Customer Care</p>
                  <p className="text-white font-medium">1800-123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-slate-300 text-sm">Email Support</p>
                  <p className="text-white font-medium">support@groceryease.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-300 text-sm">Head Office</p>
                  <p className="text-white font-medium text-sm">
                    123, Market Street,<br />
                    Koramangala, Bengaluru<br />
                    Karnataka - 560034
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h5 className="text-sm font-semibold mb-3">We Accept</h5>
              <div className="flex space-x-2">
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-slate-800">VISA</div>
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-slate-800">MC</div>
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-orange-500">RUPAY</div>
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-blue-600">UPI</div>
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center text-xs font-bold text-slate-800">COD</div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <h5 className="text-sm font-semibold mb-3">Download App</h5>
              <div className="flex space-x-2">
                <button className="bg-black px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-800 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span className="text-xs">App Store</span>
                </button>
                <button className="bg-black px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-800 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <span className="text-xs">Play Store</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-slate-400 text-sm">
              © {currentYear} GroceryEase. All Rights Reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">Refund Policy</a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">Shipping Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-primary/10 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="text-slate-700 dark:text-slate-300">100% Genuine Products</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"/>
              </svg>
              <span className="text-slate-700 dark:text-slate-300">Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              <span className="text-slate-700 dark:text-slate-300">Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              <span className="text-slate-700 dark:text-slate-300">24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
