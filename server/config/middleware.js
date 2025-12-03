const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // Skip authentication for public routes
  const publicPaths = ['/login', '/register', '/products', '/products/', '/orders', '/orders/', '/api/stats', '/api/refresh'];
  const isPublicPath = publicPaths.some(path => req.path.startsWith(path));
  
  if (isPublicPath) {
    console.log('Allowing public access to:', req.path);
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Custom routes for authentication
module.exports = (req, res, next) => {
  // Handle login
  if (req.method === 'POST' && req.path === '/login') {
    const { email, password } = req.body;
    // This is a simplified example - in a real app, you'd check against a users database
    if (email === 'admin@example.com' && password === 'admin123') {
      const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Handle register
  if (req.method === 'POST' && req.path === '/register') {
    // In a real app, you'd add the user to your users database
    const token = jwt.sign({ email: req.body.email, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(201).json({ token });
  }

  // For all other routes, check authentication
  return authenticateToken(req, res, next);
};
