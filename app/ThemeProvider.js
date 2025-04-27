// In a separate ThemeProvider.js component
'use client'
import { useState, useEffect } from 'react'
import { ThemeProvider } from 'next-themes'

export default function ThemeProviderWrapper({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" // Changed from "dark" to "system"
      enableColorScheme={true} 
      enableSystem={true} // Explicitly set to true
    >
      {children}
    </ThemeProvider>
  )
}