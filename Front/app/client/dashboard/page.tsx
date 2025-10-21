"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ClaimCard } from "@/components/claims/claim-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Clock, CheckCircle } from "lucide-react"
import { claimsApi } from "@/lib/api"
import type { Claim } from "@/types"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function ClientDashboard() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await claimsApi.getClaims()
        // Filter claims to only show the logged-in user's claims
        // This is a safeguard in case the backend doesn't filter properly
        const filteredClaims = user ? data.filter((claim) => claim.owner === user.username) : []
        setClaims(filteredClaims)
      } catch (error) {
        console.error("Error fetching claims:", error)
        toast.error("Failed to load claims")
      } finally {
        setIsLoading(false)
      }
    }

    fetchClaims()
  }, [user])

  const stats = {
    total: claims.length,
    pending: claims.filter((c) => c.status === "PENDING").length,
    inProcess: claims.filter((c) => c.status === "IN_PROCESS").length,
    resolved: claims.filter((c) => c.status === "RESOLVED" || c.status === "CLOSED").length,
  }

  const recentClaims = claims.slice(0, 3)

  return (
    <ProtectedRoute requiredRole="CLIENTE">
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Link href="/client/claims/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Claim
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Claims</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Process</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.inProcess}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Claims */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Claims</CardTitle>
                <Link href="/client/claims">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : recentClaims.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentClaims.map((claim) => (
                    <ClaimCard key={claim.id} claim={claim} showActions={false} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No claims</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new claim.</p>
                  <div className="mt-6">
                    <Link href="/client/claims/new">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Claim
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
