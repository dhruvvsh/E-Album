import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const AUTH_PATHS = ['/users/login', '/users/register']

const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('Token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || ''
    const isAuthCall = AUTH_PATHS.some((path) => url.startsWith(path))

    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem('Token')
      localStorage.removeItem('tripMemoryUser')
      if (window.location.pathname !== '/auth') {
        window.location.assign('/auth')
      }
    }
    return Promise.reject(error)
  }
)

export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data
  if (data?.message && data?.error) return `${data.message}: ${data.error}`
  return data?.message || error?.message || fallback
}

export default api
