"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, PlusCircle, GraduationCap, AlertTriangle } from "lucide-react"

export function TeacherSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? "active" : ""
  }

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-sm">
      <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
        <Link href="/teacher/dashboard" className="flex items-center gap-2 font-semibold text-primary">
          <GraduationCap className="h-6 w-6" />
          <span className="text-gray-800 dark:text-white">Espace Enseignant</span>
        </Link>
      </div>
      <div className="py-5">
        <p className="px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Principal
        </p>
        <nav className="space-y-1 px-3">
          <Link
            href="/teacher/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors
              ${
                isActive("/teacher/dashboard")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/teacher/resources"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors
              ${
                isActive("/teacher/resources")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            <FileText className="h-4 w-4" />
            Mes ressources
          </Link>
          <Link
            href="/teacher/requests"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors
              ${
                isActive("/teacher/requests")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            <PlusCircle className="h-4 w-4" />
            Suivre demande
          </Link>
        </nav>
      </div>
      <div className="py-3">
        <p className="px-6 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Maintenance
        </p>
        <nav className="space-y-1 px-3">
          <Link
            href="/teacher/breakdowns"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors
              ${
                isActive("/teacher/breakdowns")
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
            prefetch={true}
            scroll={false}
          >
            <AlertTriangle className="h-4 w-4" />
            Suivre panne
          </Link>
        </nav>
      </div>
    </div>
  )
}
