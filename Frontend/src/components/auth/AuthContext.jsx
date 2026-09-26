import { createContext, useContext, useState, useEffect } from 'react'
import api from '@/lib/api'

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
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const[isAuthenticated,setIsAuthenticated]=useState(false);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('tripMemoryUser')
    const token = localStorage.getItem('Token')
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('tripMemoryUser')
      }
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoggingIn(true);

      const res = await api.post('/users/login', {
        email,
        password,
      });

      const { user, token } = res.data;

      setUser(user);
      localStorage.setItem("tripMemoryUser", JSON.stringify(user));
      localStorage.setItem("Token", token);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      setIsAuthenticated(false);
       console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    } finally {
      setIsLoggingIn(false);
    }
  }

  // Signup function
  const signup = async (username, email, password) => {
    if (!username || !email || !password) {
      return { success: false, error: 'All fields are required' }
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }

    try {
      setIsSigningUp(true)

      const res = await api.post('/users/register', {
        username,
        email,
        password,
      })

      const { user, token } = res.data

      setUser(user)
      localStorage.setItem('tripMemoryUser', JSON.stringify(user))
      localStorage.setItem('Token', token)
      setIsAuthenticated(true)

      return { success: true }
    } catch (error) {
      setIsAuthenticated(false)
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed',
      }
    } finally {
      setIsSigningUp(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false);
    localStorage.removeItem('tripMemoryUser')
    localStorage.removeItem('Token')
  }

  const value = {
    user,
    isLoading,
    isLoggingIn,
    isSigningUp,
    login,
    signup,
    logout,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}