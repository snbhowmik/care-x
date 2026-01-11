"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { AUTH_DB } from "@/config/auth-config"

export interface User {
  id: string
  name: string
  email: string
  walletAddress: string
  privateKey: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, pass: string) => Promise<void>
  signOut: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing session
    const storedUser = sessionStorage.getItem("carex_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true)
    setError(null)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const db = AUTH_DB;
      const record = db[email];

      if (!record) {
        throw new Error("User not found")
      }
      if (record.password !== pass) {
        throw new Error("Invalid password")
      }

      const newUser: User = {
        id: "usr_" + Math.random().toString(36).substr(2, 9),
        name: record.name,
        email: email,
        walletAddress: record.walletAddress,
        privateKey: record.privateKey
      }

      sessionStorage.setItem("carex_user", JSON.stringify(newUser))
      setUser(newUser)
    } catch (e: any) {
      setError(e.message || "Authentication failed")
      throw e;
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    sessionStorage.removeItem("carex_user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signOut, error }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
