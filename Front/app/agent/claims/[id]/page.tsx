"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, User, AlertCircle, CheckCircle, X } from "lucide-react"
import { claimsApi } from "@/lib/api"
import type { Claim, ClaimStatus } from "@/types"
import { toast } from "sonner"

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROCESS: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
}

const priorityColors = {
  ALTA: "bg-red-100 text-red-800",
  MEDIA: "bg-orange-100 text-orange-800",
  BAJA: "bg-green-100 text-green-800",
}

const typeLabels = {
  FACTURA: "Invoice",
  CONSULTA: "Consultation",
  CORTO_SERVICIO: "Other Service",
}

export default function ClaimDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [claim, setClaim] = useState<Claim | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState<ClaimStatus>("PENDING")

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const data = await claimsApi.getClaim(params.id as string)
        setClaim(data)
        setNewStatus(data.status)
      } catch (error) {
        console.error("Error fetching claim:", error)
        toast.error("Failed to load claim details")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchClaim()
    }
  }, [params.id])

  // Cierre automático si se selecciona "CLOSED" en el selector y el reclamo no está cerrado aún
  useEffect(() => {
    if (newStatus === "CLOSED" && claim?.status !== "CLOSED") {
      const closeClaimAutomatically = async () => {
        setIsUpdating(true)
        try {
          const updated = await claimsApi.closeClaim(claim!.id)
          setClaim(updated)
          toast.success("Claim closed successfully")
        } catch (error: any) {
          const message = error?.response?.data?.message || "Failed to close claim"
          toast.error(message)
          // Revertir el estado al anterior si falla el cierre
          setNewStatus(claim!.status)
        } finally {
          setIsUpdating(false)
        }
      }
      closeClaimAutomatically()
    }
  }, [newStatus, claim])

  const handleStatusUpdate = async () => {
    if (!claim || newStatus === claim.status) return

    setIsUpdating(true)
    try {
      const updatedClaim = await claimsApi.updateClaim(claim.id, { status: newStatus })
      setClaim(updatedClaim)
      toast.success("Claim updated successfully")
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to update claim"
      toast.error(message)
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole="AGENTE">
        <DashboardLayout>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (!claim) {
    return (
      <ProtectedRoute requiredRole="AGENTE">
        <DashboardLayout>
          <div className="text-center py-12">
            <div className="text-gray-500">Claim not found</div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="AGENTE">
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Claim Details</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{claim.title}</CardTitle>
                    <Badge className={statusColors[claim.status]}>{claim.status.replace("_", " ")}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <p className="mt-1 text-gray-900">{claim.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Type</Label>
                      <p className="mt-1 text-gray-900">{typeLabels[claim.type]}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Priority</Label>
                      <Badge className={priorityColors[claim.priority] || "bg-gray-200 text-gray-800"}>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {claim.priority || "N/A"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-2" />
                      <span>Owner: {claim.owner}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Created: {new Date(claim.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {claim.updateDate !== claim.createdDate && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Last Updated: {new Date(claim.updateDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Update Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">New Status</Label>
                    <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ClaimStatus)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROCESS">In Process</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating || newStatus === claim.status}
                    className="w-full"
                  >
                    {isUpdating ? "Updating..." : "Update Status"}
                  </Button>
                </CardContent>
              </Card>

              {claim.status !== "CLOSED" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {claim.status !== "RESOLVED" && (
                      <Button
                        onClick={async () => {
                          setIsUpdating(true)
                          try {
                            const updated = await claimsApi.resolveClaim(claim.id)
                            setClaim(updated)
                            setNewStatus(updated.status)
                            toast.success("Claim marked as resolved")
                          } catch (error: any) {
                            const message = error?.response?.data?.message || "Failed to resolve claim"
                            toast.error(message)
                          } finally {
                            setIsUpdating(false)
                          }
                        }}
                        disabled={isUpdating}
                        className="w-full"
                        variant="outline"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Resolved
                      </Button>
                    )}

                    <Button
                      onClick={async () => {
                        setIsUpdating(true)
                        try {
                          const updated = await claimsApi.closeClaim(claim.id)
                          setClaim(updated)
                          setNewStatus(updated.status)
                          toast.success("Claim closed successfully")
                        } catch (error: any) {
                          const message = error?.response?.data?.message || "Failed to close claim"
                          toast.error(message)
                        } finally {
                          setIsUpdating(false)
                        }
                      }}
                      disabled={isUpdating}
                      className="w-full"
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Close Claim
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
