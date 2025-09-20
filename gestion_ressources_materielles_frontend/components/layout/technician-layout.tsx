"use client"

import type React from "react"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface TechnicianLayoutProps {
  children: React.ReactNode
}

export default function TechnicianLayout({ children }: TechnicianLayoutProps) {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Espace Technicien</h1>
            <span className="text-sm text-muted-foreground">
              {user.name} | {user.department}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </header>
      <main className="container py-6 px-4">{children}</main>
    </div>
  )
}
