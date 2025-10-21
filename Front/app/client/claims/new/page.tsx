"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ClaimForm } from "@/components/claims/claim-form"

export default function NewClaimPage() {
  return (
    <ProtectedRoute requiredRole="CLIENTE">
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New Claim</h1>
          <ClaimForm />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
