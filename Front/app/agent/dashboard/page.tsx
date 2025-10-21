"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ClaimCard } from "@/components/claims/claim-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, AlertTriangle, CheckCircle, Users } from "lucide-react"
import { claimsApi } from "@/lib/api"
import type { Claim } from "@/types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function AgentDashboard() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        // For agents, we want to show all claims from the API
        const data = await claimsApi.getClaims()
        setClaims(data)
      } catch (error) {
        console.error("Error fetching claims:", error)
        toast.error("Failed to load claims")
      } finally {
        setIsLoading(false)
      }
    }

    fetchClaims()
  }, [])

  const stats = {
    total: claims.length,
    pending: claims.filter((c) => c.status === "PENDING").length,
    inProcess: claims.filter((c) => c.status === "IN_PROCESS").length,
    highPriority: claims.filter((c) => c.priority === "ALTA" && c.status !== "CLOSED").length,
    resolved: claims.filter((c) => c.status === "RESOLVED" || c.status === "CLOSED").length,
  }

  // Filter to show only high priority claims by default
  const highPriorityClaims = claims.filter((c) => c.priority === "ALTA" && c.status !== "CLOSED")

  const handleUpdateClaim = (claim: Claim) => {
    router.push(`/agent/claims/${claim.id}`)
  }

  return (
    <ProtectedRoute requiredRole="AGENTE">
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
            <Button onClick={() => router.push("/agent/claims")}>View All Claims</Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
                  <Users className="h-8 w-8 text-blue-600" />
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
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">High Priority</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.highPriority}</p>
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

          {/* High Priority Claims */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  High Priority Claims
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push("/agent/claims?priority=ALTA")}>
                  View All High Priority
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : highPriorityClaims.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {highPriorityClaims.map((claim) => (
                    <ClaimCard key={claim.id} claim={claim} onUpdate={handleUpdateClaim} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No high priority claims</h3>
                  <p className="mt-1 text-sm text-gray-500">All high priority claims have been addressed.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
