import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing logged in user
    const loggedInUser = localStorage.getItem('logged_in_user')
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Validation
      if (!username || !password) {
        return { success: false, error: 'Username and password are required' }
      }
      
      // Check if this is the owner account
      if (username === 'owner' && password === 'OwnerPass1!') {
        // Create owner user object for session
        const userSession = {
          id: 'owner-' + Date.now().toString(),
          username: username,
          name: 'Store Owner',
          phone: '9876543210',
          isOwner: true,
          loginTime: new Date().toISOString()
        }
        
        // Set logged_in flag and user session
        localStorage.setItem('logged_in', 'true')
        localStorage.setItem('logged_in_user', JSON.stringify(userSession))
        setUser(userSession)
        
        return { success: true, isOwner: true }
      }
      
      // Get stored users from localStorage
      const storedUsers = localStorage.getItem('users')
      const users = storedUsers ? JSON.parse(storedUsers) : {}
      
      // Check if user exists and password matches
      if (users[username] && users[username] === password) {
        // Create regular user object for session
        const userSession = {
          id: Date.now().toString(),
          username: username,
          name: username.charAt(0).toUpperCase() + username.slice(1),
          phone: '9876543210',
          isOwner: false,
          loginTime: new Date().toISOString()
        }
        
        // Set logged_in flag and user session
        localStorage.setItem('logged_in', 'true')
        localStorage.setItem('logged_in_user', JSON.stringify(userSession))
        setUser(userSession)
        
        return { success: true, isOwner: false }
      } else {
        return { success: false, error: 'Invalid username or password' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const signup = async (username, password, confirmPassword) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Validation
      if (!username || !password) {
        return { success: false, error: 'Username and password are required' }
      }
      
      if (password.length < 4) {
        return { success: false, error: 'Password must be at least 4 characters long' }
      }
      
      if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' }
      }

      // Get existing users from localStorage
      const storedUsers = localStorage.getItem('users')
      const users = storedUsers ? JSON.parse(storedUsers) : {}
      
      // Check if user already exists
      if (users[username]) {
        return { success: false, error: 'Username already exists' }
      }

      // Add new user to the users object
      users[username] = password
      localStorage.setItem('users', JSON.stringify(users))
      
      return { success: true, message: 'Account created successfully! Please login.' }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'Failed to create account. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('logged_in')
    localStorage.removeItem('logged_in_user')
  }

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
