"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { TeacherSidebar } from "./teacher-sidebar"
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

interface TeacherLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function TeacherLayout({ children, title, subtitle }: TeacherLayoutProps) {
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)

  // Only show user data after client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNotificationClick = () => {
    setNotificationCount(0)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-white dark:bg-gray-800 shadow-sm px-6 flex items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          <div className="ml-auto flex items-center gap-5">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 py-1.5 px-3 rounded-full">
              Enseignant • {user?.department}
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={handleNotificationClick}
                >
                  <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                    {notificationCount > 0 ? notificationCount : null}
                  </span>
                  <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-80 p-0 rounded-lg shadow-lg border-gray-200 dark:border-gray-700"
              >
                <div className="border-b p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">Notifications</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Changements récents de statut</p>
                </div>
                <div className="max-h-80 overflow-auto">
                  <div className="p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="h-2.5 w-2.5 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          Statut de panne mis à jour
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Ordinateur portable HP - Salle 101
                        </p>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1 bg-blue-50 dark:bg-blue-900/20 py-0.5 px-1.5 rounded inline-block">
                          En attente → En cours de réparation
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Il y a 2 heures</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="h-2.5 w-2.5 mt-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Panne résolue</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Projecteur Epson - Salle 205</p>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1 bg-green-50 dark:bg-green-900/20 py-0.5 px-1.5 rounded inline-block">
                          En cours de réparation → Réparé
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Il y a 1 jour</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="h-2.5 w-2.5 mt-1.5 rounded-full bg-yellow-500 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          Demande de ressource mise à jour
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Imprimante - 2 unités</p>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1 bg-yellow-50 dark:bg-yellow-900/20 py-0.5 px-1.5 rounded inline-block">
                          En attente → En attente de la réunion
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Il y a 3 jours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <User className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  <span className="sr-only">Menu utilisateur</span>
                </Button>
              </DropdownMenuTrigger>
              {mounted && (
                <DropdownMenuContent align="end" className="w-56 p-1 rounded-lg shadow-lg">
                  <DropdownMenuLabel className="px-3 py-2 text-gray-800 dark:text-gray-100">
                    {user?.name}
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="px-3 py-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 focus:bg-red-50 dark:focus:bg-red-900/20 rounded-md mx-1 px-3 py-2"
                  >
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
