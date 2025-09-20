"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, CheckSquare, PenToolIcon as Tool, Building } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? "active" : ""
  }

  const supplierNavItems = [
    {
      title: "Offres en cours",
      href: "/tenders",
      icon: FileText,
      variant: "default",
    },
    {
      title: "Offres soumises",
      href: "/submitted-offers",
      icon: CheckSquare,
      variant: "default",
    },
    {
      title: "Demandes de maintenance",
      href: "/service-requests",
      icon: Tool,
      variant: "default",
    },
  ]

  return (
    <div className="w-64 h-screen bg-muted/40 border-r flex flex-col">
      <div className="h-14 border-b flex items-center px-6">
        <Link href="/tenders" className="flex items-center gap-2 font-semibold">
          <Building className="h-6 w-6" />
          <span>Gestionnaire de Fournisseurs</span>
        </Link>
      </div>
      <div className="py-4">
        <p className="px-4 text-xs font-medium text-muted-foreground mb-2">Principal</p>
        <nav className="space-y-1">
          {supplierNavItems.map((item) => (
            <Link key={item.href} href={item.href} className={`sidebar-link ${isActive(item.href)}`}>
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
