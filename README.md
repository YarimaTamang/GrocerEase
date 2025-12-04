# GroceryEase - Modern Grocery Delivery App

GroceryEase is a full-stack grocery delivery application built with React and JSON Server. It demonstrates modern web development practices including external API integration, CRUD operations, and responsive design.

## Features

- 🛒 **Product Browsing**: View products by categories (fruits, vegetables, dairy, snacks, etc.)
- 🔍 **Advanced Search & Filter**: Find products with search, category filters, and sorting options
- 🛍️ **Shopping Cart**: Add/remove items, update quantities with real-time updates
- 👤 **User Authentication**: Login, signup, and protected routes
- 🛡️ **Admin Panel**: Product management with CRUD operations for owners
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🌓 **Dark Mode**: Built-in dark/light theme support
- ⚡ **Fast Performance**: Optimized with React 19 and Vite
- 🔄 **External API Integration**: Fetches data from Open Food Facts API

## Video Walkthrough & Code Explanation
Watch the project demonstration and code walkthrough here:<br>
[GrocerEase - Demo](https://drive.google.com/file/d/13IMFKBe84mcIjakvISFmzFptPOdamwW4/view?usp=sharing)<br> 
[GrocerEase - Code Walkthrough](https://drive.google.com/file/d/115yJtLGRam9xoypfOGX6IOuPoPleiLKT/view?usp=sharing)

## Project Architecture

```
grocery-app/
├── server/                     # Backend (JSON Server + custom logic)
│   ├── db.json                 # Main database file (products, orders, users)
│   ├── initDB.js               # Fetches data from Open Food Facts & seeds db.json
│   ├── server.js               # Express + JSON Server, init/refresh/stat endpoints
│   ├── config/
│   │   └── middleware.js       # Authentication middleware (JWT)
│   └── package.json            # Server dependencies & scripts
├── src/                        # Frontend source
│   ├── api/
│   │   ├── api.js              # Main API client (talks to backend, with fallbacks)
│   │   ├── fakeAPI.js          # Node/browser helpers to call Open Food Facts
│   │   └── dataService.js      # Data layer (localStorage cache, CRUD, fallbacks)
│   ├── components/             # Reusable UI components
│   │   ├── ProductCard.jsx
│   │   ├── ProductList.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Filters.jsx
│   │   └── Modal.jsx
│   ├── context/                # React context providers
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/                  # Page components
│   │   ├── Home.jsx
│   │   ├── ProductPage.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Orders.jsx
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Admin.jsx
│   ├── utils/
│   │   ├── helpers.js          # UI/formatting utilities
│   │   └── localStorage.js     # Browser storage helpers (products, orders, cart)
│   ├── App.jsx                 # Main App component
│   └── main.jsx                # Entry point
├── public/                     # Static assets
├── .env                        # Environment variables
├── package.json                # Frontend dependencies & scripts
└── README.md                   # This file
```

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React 19.2.0** - Modern React with hooks
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔄 **React Router 7.9.6** - Client-side routing
- 🛠️ **Vite 7.2.4** - Fast build tool and dev server
- 🎯 **React Icons 5.5.0** - Icon library
- 📱 **React Toastify 11.0.5** - Notification system
- 🌐 **Axios 1.13.2** - HTTP client

### Backend
- 🚀 **JSON Server 0.17.4** - REST API with database
- 🔐 **JWT 9.0.2** - Authentication tokens
- 🔄 **CORS 2.8.5** - Cross-origin resource sharing
- 📡 **Axios 1.13.2** - HTTP client for external API
- 🛠️ **Nodemon 3.0.1** - Auto-restart server in development

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd grocery-app
   ```

2. **Install all dependencies**
   ```bash
   # Install both frontend and server dependencies
   npm run install:all
   ```

### Running the Application

#### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev:all
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

#### Option 2: Run Separately
```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start backend
npm run server
```

#### Option 3: Development with Auto-restart
```bash
# Terminal 1: Start frontend with hot reload
npm run dev

# Terminal 2: Start backend with nodemon
npm run dev:server
```

## 🔧 API Endpoints

### Products (CRUD Operations)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get single product |
| POST | `/products` | Create new product (Admin only) |
| PUT | `/products/:id` | Update product (Admin only) |
| DELETE | `/products/:id` | Delete product (Admin only) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | Get all orders |
| POST | `/orders` | Create new order |
| GET | `/orders/:id` | Get single order |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | User login |
| POST | `/register` | User registration |

## 🌐 External API Integration

### Open Food Facts Integration

The application integrates with the **Open Food Facts API** to fetch real grocery product data and persist it to the local JSON Server database.

**End-to-end flow:**

1. **Fetch from Open Food Facts (server-side)**  
   - `server/initDB.js` and `src/api/fakeAPI.js` call the Open Food Facts API
   - Multiple category endpoints are used (groceries, fruits, vegetables, dairy, cereals, etc.)
2. **Transform & clean data**  
   - Map raw categories to internal ones (fruits, vegetables, dairy, bakery, cereals, spices, packed food)
   - Generate demo-friendly fields (price, stock, rating, tags, description)
3. **Persist to `server/db.json`**  
   - On server startup, `server.js` checks `db.json` and runs `initializeDatabase` if needed
   - A `/api/refresh` endpoint lets you manually re-fetch & merge new data
   - A `/api/stats` endpoint exposes counts and last-sync info
4. **Serve to the frontend**  
   - Frontend `src/api/api.js` calls the JSON Server API (e.g. `/products`)
   - If the backend is down or unreachable, `dataService.js` + `localStorage.js` provide a **fallback** using cached data in the browser.

### External API Features
- Automatic (or on-demand) database initialization from Open Food Facts
- Duplicate prevention based on product names
- Category mapping for a consistent internal structure
- File-based persistence via `server/db.json`
- LocalStorage caching on the frontend for offline/slow-network scenarios
- Graceful error handling with fallbacks to existing data

## 🗄️ Database Structure

### Products Collection
```json
{
  "id": "1",
  "name": "Organic Banana (1 kg)",
  "price": 58,
  "category": "fruits",
  "image": "https://example.com/image.jpg",
  "weight": "1 kg",
  "rating": 4.4,
  "stock": 120,
  "tags": ["fresh", "organic"],
  "description": "Product description",
  "nutrition": "Nutrition information"
}
```

### Orders Collection
```json
{
  "id": "order123",
  "name": "Customer Name",
  "phone": "1234567890",
  "address": "Delivery Address",
  "items": [...],
  "totals": {...},
  "paymentMethod": "cod",
  "status": "placed",
  "createdAt": "2025-12-03T..."
}
```

## 🧩 Key Components

### 1. Home Page (`Home.jsx`)
- Product browsing with search and filtering
- Integration with both local and external API data
- Real-time product updates
- Category-based navigation

### 2. Admin Panel (`Admin.jsx`)
- Full CRUD operations for products
- Product creation with image preview
- Product editing and deletion
- Protected route (owner-only access)

### 3. Shopping Cart (`Cart.jsx`)
- Cart state management
- Quantity updates
- Price calculations
- Checkout integration

### 4. Authentication System
- JWT-based authentication
- Protected routes
- Role-based access control (user/owner)
- Context-based state management

## 🔒 Authentication & Authorization

### Features
- JWT token-based authentication
- Protected routes for authenticated users
- Owner-only admin access
- Automatic token refresh
- Logout functionality

### User Roles
- **User**: Can browse products, place orders, manage profile
- **Owner**: Full admin access to product management

## 🎨 UI/UX Features

### Design System
- **Tailwind CSS** for consistent styling
- **Dark Mode** support with theme context
- **Responsive Design** (mobile-first approach)
- **Loading States** with skeleton screens
- **Toast Notifications** for user feedback

### Interactive Elements
- Hover effects and transitions
- Modal dialogs for product details
- Search with real-time filtering
- Category-based product filtering
- Sorting options (price, rating)

## 📊 State Management

### React Context
- **AuthContext**: User authentication state
- **CartContext**: Shopping cart state
- **ThemeContext**: Dark/light theme preference

### Local Storage
- Cart persistence across sessions
- User preferences
- Authentication tokens

## 🔧 Configuration Files

### Environment Variables (.env)
```env
VITE_API_BASE_URL=http://localhost:3001
```

### Vite Configuration
- React plugin
- Development server setup
- Build optimization

### Tailwind Configuration
- Custom color palette
- Responsive breakpoints
- Dark mode support

## 🚀 Production Deployment

### Build Process
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Production Considerations
- Environment variable configuration
- API endpoint updates
- Static asset optimization
- CORS configuration for production domains

## 🧪 Testing & Development

### Development Tools
- ESLint for code quality
- React Developer Tools
- Browser DevTools for debugging
- JSON Server automatic restart with nodemon

### API Testing
- Products endpoint: http://localhost:3001/products
- Orders endpoint: http://localhost:3001/orders
- Health check: http://localhost:3001

## 🐛 Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 3001 and 5173 are available
2. **CORS errors**: Check server CORS configuration
3. **Database issues**: Verify `data/db.json` exists and is valid JSON
4. **External API failures**: Check Open Food Facts API availability

### Debug Commands
```bash
# Check server logs
npm run server

# Test API endpoints
curl http://localhost:3001/products

# Check database contents
cat data/db.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow existing code style
- Add appropriate comments
- Test all functionality
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [JSON Server](https://github.com/typicode/json-server) - Fake REST API
- [Open Food Facts](https://world.openfoodfacts.org/) - External product data
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vite](https://vitejs.dev/) - Build tool

---

**GroceryEase** - Modern grocery delivery with full-stack implementation demonstrating React, JSON Server, and external API integration.



