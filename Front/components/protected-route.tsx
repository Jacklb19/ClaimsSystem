"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { UserRole } from "@/types"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (requiredRole) {
      // Check if user has the required role
      const hasRequiredRole = hasRole(requiredRole)
      if (!hasRequiredRole) {
        router.push("/unauthorized")
        return
      }
    }
  }, [isAuthenticated, hasRole, requiredRole, router])

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null
  }

  return <>{children}</>
}
