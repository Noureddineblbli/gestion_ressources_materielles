"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { Sidebar } from "./sidebar"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { User, LogOut, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MainLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

// Mock notifications data - in a real app, this would come from an API
const initialNotifications = [
  {
    id: 1,
    type: "new_offer",
    title: "Nouvelle offre disponible",
    message: "Une nouvelle offre pour des équipements informatiques est disponible",
    time: "Il y a 30 minutes",
    read: false,
  },
  {
    id: 2,
    type: "submission_accepted",
    title: "Offre acceptée",
    message: "Votre offre pour 'Fourniture de 20 ordinateurs portables' a été acceptée",
    time: "Il y a 2 heures",
    read: false,
  },
  {
    id: 3,
    type: "submission_rejected",
    title: "Offre rejetée",
    message: "Votre offre pour 'Maintenance des serveurs' a été rejetée",
    time: "Hier",
    read: true,
  },
]

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)

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
  }, [])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b bg-muted/40 px-6 flex items-center">
          <div>
            <h1 className="text-lg font-medium">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Gestionnaire • Service des fournisseurs</div>

            {/* Notifications Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full h-8 w-8">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="border-b p-3 flex items-center justify-between">
                  <h4 className="font-medium">Notifications</h4>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
                      Tout marquer comme lu
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 ${notification.read ? "" : "bg-muted/30"}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 mt-0.5">
                            {notification.type === "new_offer" && (
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            )}
                            {notification.type === "submission_accepted" && (
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            )}
                            {notification.type === "submission_rejected" && (
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">Aucune notification</div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 border">
                  <User className="h-4 w-4" />
                  <span className="sr-only">Menu utilisateur</span>
                </Button>
              </DropdownMenuTrigger>
              {mounted && (
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.companyName}</DropdownMenuLabel>
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
