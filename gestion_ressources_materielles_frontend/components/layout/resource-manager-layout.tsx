"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { ResourceManagerSidebar } from "./resource-manager-sidebar"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ResourceManagerLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function ResourceManagerLayout({ children, title, subtitle }: ResourceManagerLayoutProps) {
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Only show user data after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex h-screen">
      <ResourceManagerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b bg-muted/40 px-6 flex items-center">
          <div>
            <h1 className="text-lg font-medium">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Gestionnaire • Service des ressources</div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 border">
                  <User className="h-4 w-4" />
                  <span className="sr-only">Menu utilisateur</span>
                </Button>
              </DropdownMenuTrigger>
              {mounted && (
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
