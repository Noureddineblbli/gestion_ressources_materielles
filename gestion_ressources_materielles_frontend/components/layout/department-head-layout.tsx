"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { DepartmentHeadSidebar } from "./department-head-sidebar"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogOut, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

interface DepartmentHeadLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

// Mock notifications data
const initialNotifications = [
  {
    id: 1,
    title: "Nouvelle demande de ressource",
    message: "Prof. Martin a soumis une demande pour 3 ordinateurs",
    time: "Il y a 10 minutes",
    read: false,
  },
  {
    id: 2,
    title: "Réunion de département",
    message: "Rappel: Réunion de département demain à 14h00",
    time: "Il y a 2 heures",
    read: false,
  },
  {
    id: 3,
    title: "Budget approuvé",
    message: "Le budget pour les ressources informatiques a été approuvé",
    time: "Hier",
    read: true,
  },
  {
    id: 4,
    title: "Maintenance planifiée",
    message: "Maintenance des serveurs prévue ce weekend",
    time: "Il y a 2 jours",
    read: true,
  },
]

export function DepartmentHeadLayout({ children, title, subtitle }: DepartmentHeadLayoutProps) {
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const router = useRouter()

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  // Only show user data after client-side hydration
  useEffect(() => {
    setMounted(true)

    // Ensure user has department head role
    if (user && user.role !== "department-head") {
      router.push("/login-teacher")
    }
  }, [user, router])

  return (
    <div className="flex h-screen">
      <DepartmentHeadSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b bg-muted/40 px-6 flex items-center">
          <div>
            <h1 className="text-lg font-medium">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Chef • {user?.department}</div>

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full h-8 w-8">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllAsRead}>
                      Tout marquer comme lu
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`p-3 cursor-pointer ${notification.read ? "" : "bg-muted/50"}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{notification.title}</span>
                            {!notification.read && <span className="h-2 w-2 rounded-full bg-blue-500"></span>}
                          </div>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <span className="text-xs text-muted-foreground mt-1">{notification.time}</span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">Aucune notification</div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-8 w-8 p-0 overflow-hidden">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "User"} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
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
                  <DropdownMenuItem asChild>
                    <Link href="/department-head/profile">Mon profil</Link>
                  </DropdownMenuItem>
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
