// src/context/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'

/**
 * Type declarations for global app context
 */
type AppContextType = {
  snapshots: string[]
  addSnapshot: (image: string) => void
  clearSnapshots: () => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

/**
 * Custom hook to use the AppContext easily
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used inside AppProvider')
  return context
}

/**
 * AppProvider wrapper
 */
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [snapshots, setSnapshots] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  const addSnapshot = (image: string) => {
    setSnapshots(prev => [image, ...prev])
  }

  const clearSnapshots = () => {
    setSnapshots([])
  }

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  return (
    <AppContext.Provider value={{ snapshots, addSnapshot, clearSnapshots, isDarkMode, toggleDarkMode }}>
      {children}
    </AppContext.Provider>
  )
}
