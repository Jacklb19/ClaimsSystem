"use client"

import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { Home, FileText, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const clientNavItems = [
  { href: "/client/dashboard", label: "Dashboard", icon: Home },
  { href: "/client/claims", label: "My Claims", icon: FileText },
  { href: "/client/claims/new", label: "New Claim", icon: Plus },
]

const agentNavItems = [
  { href: "/agent/dashboard", label: "Dashboard", icon: Home },
  { href: "/agent/claims", label: "All Claims", icon: FileText },
]

export function Sidebar() {
  const { hasRole } = useAuth()
  const pathname = usePathname()

  // Determine which nav items to show based on user role
  const navItems = hasRole("CLIENTE") ? clientNavItems : agentNavItems

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
