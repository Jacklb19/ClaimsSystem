import axios from "axios"
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Claim,
  CreateClaimRequest,
  UpdateClaimRequest,
} from "@/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data)
    return response.data
  },

  registerAgent: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/register-agent", data)
    return response.data
  },


}

export const claimsApi = {
  getClaims: async (): Promise<Claim[]> => {
    const response = await api.get("/claims")
    return response.data
  },

  getClaim: async (id: string): Promise<Claim> => {
    const response = await api.get(`/claims/${id}`)
    return response.data
  },

  createClaim: async (data: CreateClaimRequest): Promise<Claim> => {
    const response = await api.post("/claims", data)
    return response.data
  },

  updateClaim: async (id: string, data: UpdateClaimRequest): Promise<Claim> => {
    const response = await api.put(`/claims/${id}`, data)
    return response.data
  },

  resolveClaim: async (id: string): Promise<Claim> => {
    const response = await api.put(`/claims/${id}/resolve`)
    return response.data
  },

  closeClaim: async (id: string): Promise<Claim> => {
    const response = await api.put(`/claims/${id}/close`)
    return response.data
  },
}

export default api
