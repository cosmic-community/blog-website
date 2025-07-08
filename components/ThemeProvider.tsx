'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useTheme, Theme } from '@/hooks/useTheme'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeData = useTheme()

  // Prevent hydration mismatch by applying theme on mount
  useEffect(() => {
    // This ensures the theme is applied immediately on client-side hydration
    const root = document.documentElement
    if (themeData.resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [themeData.resolvedTheme])

  // Add keyboard shortcut for theme toggle
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+/ on Mac or Ctrl+/ on Windows/Linux
      if ((event.metaKey || event.ctrlKey) && event.key === '/') {
        event.preventDefault()
        themeData.toggleTheme()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [themeData])

  return (
    <ThemeContext.Provider value={themeData}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}