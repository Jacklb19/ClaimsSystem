export type UserRole = "CLIENTE" | "AGENTE"

export type ClaimType = "FACTURA" | "CONSULTA" | "CORTO_SERVICIO"
export type ClaimPriority = "ALTA" | "MEDIA" | "BAJA"
export type ClaimStatus = "PENDING" | "IN_PROCESS" | "RESOLVED" | "CLOSED"

export interface User {
  id: string
  username: string
  role: UserRole
}

export interface Claim {
  id: string
  title: string
  description: string
  type: ClaimType
  priority: ClaimPriority
  status: ClaimStatus
  owner: string
  createdDate: string
  updateDate: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
}

export interface CreateClaimRequest {
  title: string
  description: string
  type: ClaimType
  priority: ClaimPriority
}

export interface UpdateClaimRequest {
  title?: string
  description?: string
  type?: ClaimType
  priority?: ClaimPriority
  status?: ClaimStatus
}
