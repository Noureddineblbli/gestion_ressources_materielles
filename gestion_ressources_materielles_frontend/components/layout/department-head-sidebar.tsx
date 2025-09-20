"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, PlusCircle, GraduationCap, Calendar, Settings, History } from "lucide-react"

export function DepartmentHeadSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? "active" : ""
  }

  return (
    <div className="w-64 h-screen bg-muted/40 border-r flex flex-col">
      <div className="h-14 border-b flex items-center px-6">
        <Link href="/department-head/dashboard" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6" />
          <span>Chef de Département</span>
        </Link>
      </div>
      <div className="py-4">
        <p className="px-4 text-xs font-medium text-muted-foreground mb-2">Principal</p>
        <nav className="space-y-1">
          <Link
            href="/department-head/dashboard"
            className={`sidebar-link ${isActive("/department-head/dashboard")}`}
            prefetch={true}
            scroll={false}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/department-head/resources"
            className={`sidebar-link ${isActive("/department-head/resources")}`}
            prefetch={true}
            scroll={false}
          >
            <FileText className="h-4 w-4" />
            Mes ressources
          </Link>
          <Link
            href="/department-head/requests"
            className={`sidebar-link ${isActive("/department-head/requests")}`}
            prefetch={true}
            scroll={false}
          >
            <PlusCircle className="h-4 w-4" />
            Suivre demande
          </Link>
          <Link
            href="/department-head/breakdown"
            className={`sidebar-link ${isActive("/department-head/breakdown")}`}
            prefetch={true}
            scroll={false}
          >
            <Settings className="h-4 w-4" />
            Suivre Panne
          </Link>
          <Link
            href="/department-head/manage-requests"
            className={`sidebar-link ${isActive("/department-head/manage-requests")}`}
            prefetch={true}
            scroll={false}
          >
            <Calendar className="h-4 w-4" />
            Gérer Demandes
          </Link>
          <Link
            href="/department-head/request-history"
            className={`sidebar-link ${isActive("/department-head/request-history")}`}
            prefetch={true}
            scroll={false}
          >
            <History className="h-4 w-4" />
            Historique des demandes
          </Link>
        </nav>
      </div>
    </div>
  )
}
