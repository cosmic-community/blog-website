'use client'

import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Get theme from localStorage or default to system
    const storedTheme = localStorage.getItem('theme') as Theme
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setTheme(storedTheme)
    }
  }, [])

  useEffect(() => {
    const applyTheme = () => {
      let newResolvedTheme: 'light' | 'dark' = 'light'

      if (theme === 'system') {
        newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        newResolvedTheme = theme as 'light' | 'dark'
      }

      setResolvedTheme(newResolvedTheme)
      
      // Apply theme to document
      const root = document.documentElement
      if (newResolvedTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    applyTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    if (theme === 'system') {
      // If currently on system, switch to the opposite of current resolved theme
      setThemeValue(resolvedTheme === 'dark' ? 'light' : 'dark')
    } else if (theme === 'light') {
      setThemeValue('dark')
    } else {
      setThemeValue('light')
    }
  }

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeValue,
    toggleTheme
  }
}