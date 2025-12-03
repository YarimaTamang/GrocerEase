import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  // Initialize from localStorage (if any) or current DOM class
  useEffect(() => {
    const root = document.documentElement
    const stored = localStorage.getItem('theme')

    if (stored === 'dark') {
      root.classList.add('dark')
      setIsDark(true)
    } else {
      root.classList.remove('dark')
      setIsDark(false)
    }
  }, [])

  const toggleDarkMode = () => {
    const root = document.documentElement
    const currentlyDark = root.classList.contains('dark')

    if (currentlyDark) {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <ThemeContext.Provider value={{ 
      isDark,
      toggleDarkMode,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}
