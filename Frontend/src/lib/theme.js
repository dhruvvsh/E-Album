import { useCallback, useEffect, useState } from 'react'

const readIsDark = () => document.documentElement.classList.contains('dark')

export function useTheme() {
  const [isDark, setIsDark] = useState(readIsDark)

  useEffect(() => {
    document.body.classList.remove('dark')
  }, [])

  const setTheme = useCallback((dark) => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    } catch {
      // storage unavailable; theme still applies for this session
    }
    setIsDark(dark)
  }, [])

  const toggleTheme = useCallback(() => setTheme(!readIsDark()), [setTheme])

  return { isDark, setTheme, toggleTheme }
}
