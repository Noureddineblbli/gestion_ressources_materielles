"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Package, AlertTriangle, History, ClipboardList } from "lucide-react"

export function ResourceManagerSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const navItems = [
    {
      section: "Principal",
      items: [
        {
          name: "Demandes des départements",
          href: "/resource-manager/department-requests",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          name: "Gestion des soumissions",
          href: "/resource-manager/submissions",
          icon: <ClipboardList className="h-5 w-5" />,
        },
        {
          name: "Gestion de la livraison",
          href: "/resource-manager/delivery",
          icon: <Package className="h-5 w-5" />,
        },
        {
          name: "Gestion des pannes",
          href: "/resource-manager/issues",
          icon: <AlertTriangle className="h-5 w-5" />,
        },
      ],
    },
    {
      section: "Autre",
      items: [
        {
          name: "Historique des offres",
          href: "/resource-manager/offer-history",
          icon: <History className="h-5 w-5" />,
        },
      ],
    },
  ]

  return (
    <div className="w-64 border-r bg-background h-screen flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Gestionnaire de Ressources</h2>
      </div>
      <div className="flex-1 overflow-auto py-2">
        {navItems.map((section, i) => (
          <div key={i} className="px-3 py-2">
            <h3 className="mb-2 px-4 text-sm font-semibold text-muted-foreground">{section.section}</h3>
            <div className="space-y-1">
              {section.items.map((item, j) => (
                <Link
                  key={j}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
