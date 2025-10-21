"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ClaimCard } from "@/components/claims/claim-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { claimsApi } from "@/lib/api"
import type { Claim, ClaimStatus, ClaimPriority } from "@/types"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function AgentClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | "ALL">("ALL")
  const [priorityFilter, setPriorityFilter] = useState<ClaimPriority | "ALL">("ALL")

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        // For agents, we want to show all claims from the API
        const data = await claimsApi.getClaims()
        setClaims(data)
        setFilteredClaims(data)
      } catch (error) {
        console.error("Error fetching claims:", error)
        toast.error("Failed to load claims")
      } finally {
        setIsLoading(false)
      }
    }

    fetchClaims()
  }, [])

  useEffect(() => {
    // Set initial filters from URL params
    const priority = searchParams.get("priority")
    if (priority && ["ALTA", "MEDIA", "BAJA"].includes(priority)) {
      setPriorityFilter(priority as ClaimPriority)
    }
  }, [searchParams])

  useEffect(() => {
    let filtered = claims

    if (searchTerm) {
      filtered = filtered.filter(
        (claim) =>
          claim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.owner.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((claim) => claim.status === statusFilter)
    }

    if (priorityFilter !== "ALL") {
      filtered = filtered.filter((claim) => claim.priority === priorityFilter)
    }

    setFilteredClaims(filtered)
  }, [claims, searchTerm, statusFilter, priorityFilter])

  const handleUpdateClaim = (claim: Claim) => {
    router.push(`/agent/claims/${claim.id}`)
  }

  return (
    <ProtectedRoute requiredRole="AGENTE">
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">All Claims</h1>
            <div className="text-sm text-gray-500">
              {filteredClaims.length} of {claims.length} claims
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search claims or owners..."
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
            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as any)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priority</SelectItem>
                <SelectItem value="ALTA">High</SelectItem>
                <SelectItem value="MEDIA">Medium</SelectItem>
                <SelectItem value="BAJA">Low</SelectItem>
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
                <ClaimCard key={claim.id} claim={claim} onUpdate={handleUpdateClaim} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm || statusFilter !== "ALL" || priorityFilter !== "ALL"
                  ? "No claims match your filters."
                  : "No claims found."}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
