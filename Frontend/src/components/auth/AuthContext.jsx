 import { createContext, useContext, useState, useEffect } from 'react'
 import axios from 'axios';

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
  console.log("API URL:", API_URL);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const[isAuthenticated,setIsAuthenticated]=useState(false);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('tripMemoryUser')
    const token = localStorage.getItem('Token')
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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

      const res = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      const { user, token } = res.data;

      setUser(user);
      localStorage.setItem("tripMemoryUser", JSON.stringify(user));
      localStorage.setItem("Token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      setIsAuthenticated(false);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  }

  // Signup function
  const signup = async (username, email, password) => {
    try{
    setIsLoading(true)
    
      // Basic validation
    if (!username || !email || !password) {
      setIsLoading(false)
      return { success: false, error: 'All fields are required' }
    }
    
    if (password.length < 6) {
      setIsLoading(false)
      return { success: false, error: 'Password must be at least 6 characters' }
    }

    //  API call 
   const res= await axios.post(`${API_URL}/users/register`, {
      username,
      email,
      password,
    });
       
    const {user, token}=res.data;
    
    setUser(user)
    localStorage.setItem('tripMemoryUser', JSON.stringify(user))
    localStorage.setItem('Token', token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setIsAuthenticated(true);

    return {
       success: true 

    }


  }  catch(error){
    setIsAuthenticated(false);
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
    setIsAuthenticated(false);
    localStorage.removeItem('tripMemoryUser')
    localStorage.removeItem('Token')
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    isLoading,
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