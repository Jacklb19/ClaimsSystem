"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, AlertCircle } from "lucide-react"
import type { Claim } from "@/types"

interface ClaimCardProps {
  claim: Claim
  onView?: (claim: Claim) => void
  onUpdate?: (claim: Claim) => void
  showActions?: boolean
}

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
  OTRO_SERVICIO: "Other Service",
}

export function ClaimCard({ claim, onView, onUpdate, showActions = true }: ClaimCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">{claim.title}</CardTitle>
          <div className="flex space-x-2">
            <Badge className={statusColors[claim.status]}>{claim.status.replace("_", " ")}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-2">{claim.description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={priorityColors[claim.priority]}>
            <AlertCircle className="w-3 h-3 mr-1" />
            {claim.priority}
          </Badge>
          <Badge variant="outline">{typeLabels[claim.type]}</Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <User className="w-3 h-3 mr-1" />
            {claim.owner}
          </div>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(claim.createdDate).toLocaleDateString()}
          </div>
        </div>

        {showActions && (
          <div className="flex space-x-2 pt-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(claim)} className="flex-1">
                View Details
              </Button>
            )}
            {onUpdate && claim.status !== "CLOSED" && (
              <Button size="sm" onClick={() => onUpdate(claim)} className="flex-1">
                Update
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
