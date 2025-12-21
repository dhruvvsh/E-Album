 import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('tripMemoryUser')
    const token = localStorage.getItem('token')
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser))
        axios.defaults.headers.common={'Authorization':`Bearer ${token}`}
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
      setIsLoading(true);

      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { user, token } = res.data;

      setUser(user);
      localStorage.setItem("tripMemoryUser", JSON.stringify(user));
      localStorage.setItem("tripMemoryToken", token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  }

  // Signup function
  const signup = async (name, email, password, confirmPassword) => {
    try{
    setIsLoading(true)
    
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

    //  API call 
   const res= await axios.post(`${API_URL}/signup`, {
      name,
      email,
      password,
      confirmPassword
    });
       
    const {user, token}=res.data;
    
    setUser(user)
    localStorage.setItem('tripMemoryUser', JSON.stringify(user))
    localStorage.setItem('token', token)
    
    axios.defaults.headers.common={'Authorization':`Bearer ${token}`}

    return {
       success: true 

    }


  }  catch(error){
      return { 
        success:false,
        error: error.response?.data?.message || 'Signup failed' 
      }
    } finally {
      setIsLoading(false)
    }    
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('tripMemoryUser')
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
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