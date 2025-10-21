"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ClaimCard } from "@/components/claims/claim-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { claimsApi } from "@/lib/api"
import type { Claim, ClaimStatus } from "@/types"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function ClientClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | "ALL">("ALL")
  const { user } = useAuth()

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await claimsApi.getClaims()
        // Filter claims to only show the logged-in user's claims
        const userClaims = user ? data.filter((claim) => claim.owner === user.username) : []
        setClaims(userClaims)
        setFilteredClaims(userClaims)
      } catch (error) {
        console.error("Error fetching claims:", error)
        toast.error("Failed to load claims")
      } finally {
        setIsLoading(false)
      }
    }

    fetchClaims()
  }, [user])

  useEffect(() => {
    let filtered = claims

    if (searchTerm) {
      filtered = filtered.filter(
        (claim) =>
          claim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((claim) => claim.status === statusFilter)
    }

    setFilteredClaims(filtered)
  }, [claims, searchTerm, statusFilter])

  return (
    <ProtectedRoute requiredRole="CLIENTE">
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Claims</h1>
            <Link href="/client/claims/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Claim
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROCESS">In Process</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Claims Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredClaims.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClaims.map((claim) => (
                <ClaimCard key={claim.id} claim={claim} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm || statusFilter !== "ALL" ? "No claims match your filters." : "No claims found."}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
