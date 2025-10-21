"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { claimSchema, type ClaimFormData } from "@/lib/validations"
import { claimsApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function ClaimForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClaimFormData>({
    resolver: zodResolver(claimSchema),
  })

  const onSubmit = async (data: ClaimFormData) => {
    setIsSubmitting(true)
    try {
      await claimsApi.createClaim(data)
      toast.success("Claim created successfully!")
      router.push("/client/claims")
    } catch (error) {
      toast.error("Failed to create claim. Please try again.")
      console.error("Error creating claim:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Claim</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="Enter claim title" />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your claim in detail"
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(value) => setValue("type", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select claim type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FACTURA">Invoice</SelectItem>
                  <SelectItem value="CONSULTA">Consultation</SelectItem>
                  <SelectItem value="CORTO_SERVICIO">Service Suspended</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(value) => setValue("priority", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALTA">High</SelectItem>
                  <SelectItem value="MEDIA">Medium</SelectItem>
                  <SelectItem value="BAJA">Low</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-sm text-red-600">{errors.priority.message}</p>}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Creating..." : "Create Claim"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
