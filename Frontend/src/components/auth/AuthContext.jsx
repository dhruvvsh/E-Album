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

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('tripMemoryUser')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('tripMemoryUser')
      }
    }
    setIsLoading(false)
  }, [])

  // Mock login function
  const login = async (email, password) => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication - in real app, this would validate against backend
    if (email && password) {
      const mockUser = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0], // Use email prefix as name for demo
        email: email,
        avatar: '',
        joinedDate: new Date().toISOString()
      }
      
      setUser(mockUser)
      localStorage.setItem('tripMemoryUser', JSON.stringify(mockUser))
      setIsLoading(false)
      return { success: true }
    } else {
      setIsLoading(false)
      return { success: false, error: 'Invalid email or password' }
    }
  }

  // Mock signup function
  const signup = async (name, email, password, confirmPassword) => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Basic validation
    if (!name || !email || !password) {
      setIsLoading(false)
      return { success: false, error: 'All fields are required' }
    }
    
    if (password !== confirmPassword) {
      setIsLoading(false)
      return { success: false, error: 'Passwords do not match' }
    }
    
    if (password.length < 6) {
      setIsLoading(false)
      return { success: false, error: 'Password must be at least 6 characters' }
    }
    
    // Mock user creation
    const newUser = {
      id: 'user-' + Date.now(),
      name: name,
      email: email,
      avatar: '',
      joinedDate: new Date().toISOString()
    }
    
    setUser(newUser)
    localStorage.setItem('tripMemoryUser', JSON.stringify(newUser))
    setIsLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tripMemoryUser')
  }

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}