"use client"

import type React from "react"

import { useState } from "react"
import { ResourceManagerLayout } from "@/components/layout/resource-manager-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Laptop,
  Printer,
  FileText,
  Wrench,
  Eye,
  Download,
  RotateCcw,
  PenToolIcon as Tool,
  ChevronDown,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BreakdownDetailsDialog } from "@/components/breakdown-details-dialog"
import { useToast } from "@/hooks/use-toast"
import { ReturnToSupplierDialog } from "@/components/return-to-supplier-dialog"
import { SendForRepairDialog } from "@/components/send-for-repair-dialog"

// Mock data for breakdowns
const initialBreakdowns = [
  {
    id: "INV-2025-001",
    resource: "Ordinateur portable Dell XPS",
    type: "Ordinateur",
    typeIcon: "laptop",
    reportedBy: {
      name: "Dr. John Smith",
      department: "Computer Science",
    },
    technician: {
      name: "Thomas Dubois",
      specialization: "Matériel informatique",
    },
    date: "15 mai 2025",
    frequency: "frequent",
    frequencyText: "Fréquent",
    nature: "material",
    natureText: "Matériel",
    warranty: "valid",
    warrantyText: "Sous garantie",
    status: "pending",
    statusText: "En attente",
    description:
      "L'ordinateur s'éteint aléatoirement pendant l'utilisation, même lorsque la batterie est chargée. Cela se produit environ 2-3 fois par jour.",
    supplier: "TechPro Solutions",
    warrantyEndDate: "20 octobre 2025",
  },
  {
    id: "INV-2025-004",
    resource: "Imprimante HP LaserJet",
    type: "Imprimante",
    typeIcon: "printer",
    reportedBy: {
      name: "Dr. Jane Doe",
      department: "Computer Science",
    },
    technician: {
      name: "Sophie Martin",
      specialization: "Périphériques d'impression",
    },
    date: "12 mai 2025",
    frequency: "permanent",
    frequencyText: "Permanent",
    nature: "material",
    natureText: "Matériel",
    warranty: "expired",
    warrantyText: "Expirée",
    status: "waiting_change",
    statusText: "En attente de changement",
    description:
      "L'imprimante affiche une erreur de cartouche même après remplacement. Les impressions sont de mauvaise qualité avec des stries.",
    supplier: "PrintTech",
    warrantyEndDate: "5 janvier 2025",
  },
  {
    id: "INV-2025-003",
    resource: "Ordinateur portable Dell XPS",
    type: "Ordinateur",
    typeIcon: "laptop",
    reportedBy: {
      name: "Dr. Robert Johnson",
      department: "Computer Science",
    },
    technician: {
      name: "Lucas Bernard",
      specialization: "Systèmes d'exploitation",
    },
    date: "10 mai 2025",
    frequency: "frequent",
    frequencyText: "Fréquent",
    nature: "software",
    natureText: "Logiciel (système)",
    warranty: "valid",
    warrantyText: "Sous garantie",
    status: "waiting_repair",
    statusText: "En attente de la réparation",
    description:
      "Le système d'exploitation se bloque fréquemment lors de l'utilisation d'applications gourmandes en ressources.",
    supplier: "TechPro Solutions",
    warrantyEndDate: "15 novembre 2025",
  },
  {
    id: "INV-2025-005",
    resource: "Imprimante HP LaserJet",
    type: "Imprimante",
    typeIcon: "printer",
    reportedBy: {
      name: "Dr. Michael Brown",
      department: "Mathematics",
    },
    technician: {
      name: "Sophie Martin",
      specialization: "Périphériques d'impression",
    },
    date: "8 mai 2025",
    frequency: "frequent",
    frequencyText: "Fréquent",
    nature: "material",
    natureText: "Matériel",
    warranty: "expired",
    warrantyText: "Expirée",
    status: "changed",
    statusText: "Changé",
    changeDate: "29/02/2025",
    description:
      "L'imprimante ne s'allume plus du tout. Aucun voyant ne s'allume malgré le remplacement du câble d'alimentation.",
    supplier: "PrintTech",
    warrantyEndDate: "10 décembre 2024",
  },
  {
    id: "INV-2025-006",
    resource: "Ordinateur de bureau HP",
    type: "Ordinateur",
    typeIcon: "laptop",
    reportedBy: {
      name: "Dr. Sarah Wilson",
      department: "Mathematics",
    },
    technician: {
      name: "Emma Petit",
      specialization: "Logiciels spécialisés",
    },
    date: "5 mai 2025",
    frequency: "rare",
    frequencyText: "Rare",
    nature: "software",
    natureText: "Logiciel (utilitaire)",
    warranty: "expired",
    warrantyText: "Expirée",
    status: "repaired",
    statusText: "Réparé",
    repairDate: "15/03/2025",
    description:
      "Problèmes de compatibilité avec le logiciel de modélisation mathématique. Plantages fréquents lors de calculs complexes.",
    supplier: "HP Enterprise",
    warrantyEndDate: "20 novembre 2024",
  },
  {
    id: "INV-2025-008",
    resource: "Ordinateur portable Lenovo ThinkPad",
    type: "Ordinateur",
    typeIcon: "laptop",
    reportedBy: {
      name: "Dr. Emily Green",
      department: "Biology",
    },
    technician: {
      name: "Thomas Dubois",
      specialization: "Matériel informatique",
    },
    date: "2 mai 2025",
    frequency: "permanent",
    frequencyText: "Permanent",
    nature: "material",
    natureText: "Matériel",
    warranty: "expired",
    warrantyText: "Expirée",
    status: "pending",
    statusText: "En attente",
    description:
      "L'écran présente des lignes verticales qui persistent même après redémarrage. La dalle semble endommagée.",
    supplier: "Lenovo France",
    warrantyEndDate: "15 janvier 2025",
  },
]

export default function Issues() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [selectedBreakdown, setSelectedBreakdown] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const [isRepairDialogOpen, setIsRepairDialogOpen] = useState(false)
  const [breakdowns, setBreakdowns] = useState(initialBreakdowns)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Filter breakdowns based on search query, type filter, and status filter
  const filteredBreakdowns = breakdowns.filter((breakdown) => {
    const matchesSearch =
      searchQuery === "" ||
      breakdown.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breakdown.reportedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      breakdown.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "computer" && breakdown.type === "Ordinateur") ||
      (typeFilter === "printer" && breakdown.type === "Imprimante")

    const matchesStatus = statusFilter === "all" || breakdown.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const handleViewDetails = (breakdown: any) => {
    setSelectedBreakdown(breakdown)
    setIsDetailsDialogOpen(true)
  }

  const handleDownloadReport = (id: string) => {
    setIsLoading(true)

    // Simulate API call to generate and download report
    setTimeout(() => {
      setIsLoading(false)

      // Find the breakdown
      const breakdown = breakdowns.find((b) => b.id === id)
      if (!breakdown) return

      toast({
        title: "Rapport téléchargé",
        description: `Le rapport pour ${breakdown.resource} (${id}) a été téléchargé avec succès.`,
        duration: 5000,
      })

      // In a real application, this would trigger a file download
      console.log(`Downloading report for breakdown ${id}`)
    }, 1500)
  }

  const handleReturnToSupplier = (id: string) => {
    const breakdown = breakdowns.find((b) => b.id === id)
    if (!breakdown) return

    setSelectedBreakdown(breakdown)
    setIsReturnDialogOpen(true)
  }

  const handleSendForRepair = (id: string) => {
    const breakdown = breakdowns.find((b) => b.id === id)
    if (!breakdown) return

    setSelectedBreakdown(breakdown)
    setIsRepairDialogOpen(true)
  }

  const confirmReturnToSupplier = (id: string, returnData: any) => {
    setIsLoading(true)

    // Simulate API call to process return
    setTimeout(() => {
      setIsLoading(false)
      setIsReturnDialogOpen(false)

      // Update the breakdown status
      const updatedBreakdowns = breakdowns.map((breakdown) => {
        if (breakdown.id === id) {
          return {
            ...breakdown,
            status: "waiting_change",
            statusText: "En attente de changement",
            returnData: {
              note: returnData.note,
              returnDate: new Date().toLocaleDateString("fr-FR"),
            },
          }
        }
        return breakdown
      })

      setBreakdowns(updatedBreakdowns)

      toast({
        title: "Retour au fournisseur initié",
        description: `La demande de retour pour ${id} a été envoyée au fournisseur.`,
        duration: 5000,
      })
    }, 1500)
  }

  const confirmSendForRepair = (id: string, repairData: any) => {
    setIsLoading(true)

    // Simulate API call to process repair request
    setTimeout(() => {
      setIsLoading(false)
      setIsRepairDialogOpen(false)

      // Update the breakdown status
      const updatedBreakdowns = breakdowns.map((breakdown) => {
        if (breakdown.id === id) {
          return {
            ...breakdown,
            status: "waiting_repair",
            statusText: "En attente de la réparation",
            repairData: {
              note: repairData.note,
              requestDate: new Date().toLocaleDateString("fr-FR"),
            },
          }
        }
        return breakdown
      })

      setBreakdowns(updatedBreakdowns)

      toast({
        title: "Demande de réparation envoyée",
        description: `La demande de réparation pour ${id} a été envoyée.`,
        duration: 5000,
      })
    }, 1500)
  }

  return (
    <ResourceManagerLayout
      title="Gestion des pannes"
      subtitle="Examiner les rapports de panne et décider des actions à prendre"
    >
      <div className="flex flex-col space-y-4">
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="computer">Ordinateurs</SelectItem>
              <SelectItem value="printer">Imprimantes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
          >
            En attente
          </Button>
          <Button
            variant={statusFilter === "waiting_change" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("waiting_change")}
          >
            En attente de changement
          </Button>
          <Button
            variant={statusFilter === "waiting_repair" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("waiting_repair")}
          >
            En attente de la réparation
          </Button>
          <Button
            variant={statusFilter === "changed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("changed")}
          >
            Changé
          </Button>
          <Button
            variant={statusFilter === "repaired" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("repaired")}
          >
            Réparé
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Ressource</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Signalé par</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Technicien</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Fréquence</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Nature</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Garantie</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Statut</th>
                  {filteredBreakdowns.some((breakdown) => breakdown.status === "pending") && (
                    <th className="text-left p-3 text-sm font-medium text-gray-500">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredBreakdowns.map((breakdown) => (
                  <tr key={breakdown.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{breakdown.resource}</div>
                      <div className="text-xs text-gray-500">{breakdown.id}</div>
                    </td>
                    <td className="p-3">
                      {breakdown.typeIcon === "laptop" ? (
                        <div className="flex items-center">
                          <Laptop className="h-5 w-5 text-blue-600 mr-2" />
                          <span>{breakdown.type}</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Printer className="h-5 w-5 text-purple-600 mr-2" />
                          <span>{breakdown.type}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{breakdown.reportedBy.name}</div>
                      <div className="text-xs text-gray-500">{breakdown.reportedBy.department}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{breakdown.technician.name}</div>
                      <div className="text-xs text-gray-500">{breakdown.technician.specialization}</div>
                    </td>
                    <td className="p-3">{breakdown.date}</td>
                    <td className="p-3">
                      <FrequencyBadge frequency={breakdown.frequency}>{breakdown.frequencyText}</FrequencyBadge>
                    </td>
                    <td className="p-3">
                      <NatureBadge nature={breakdown.nature}>{breakdown.natureText}</NatureBadge>
                    </td>
                    <td className="p-3">
                      <WarrantyBadge warranty={breakdown.warranty}>{breakdown.warrantyText}</WarrantyBadge>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={breakdown.status}>
                        {breakdown.statusText}
                        {breakdown.status === "changed" && breakdown.changeDate && ` le ${breakdown.changeDate}`}
                        {breakdown.status === "repaired" && breakdown.repairDate && ` le ${breakdown.repairDate}`}
                      </StatusBadge>
                    </td>
                    {breakdown.status === "pending" ? (
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="link" className="text-amber-600 p-0 h-auto flex items-center">
                              Actions
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => handleViewDetails(breakdown)} className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Voir détails</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDownloadReport(breakdown.id)}
                              className="cursor-pointer"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              <span>Télécharger le rapport</span>
                            </DropdownMenuItem>
                            {breakdown.warranty === "valid" && (
                              <DropdownMenuItem
                                onClick={() => handleReturnToSupplier(breakdown.id)}
                                className="cursor-pointer"
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                <span>Retourner au fournisseur</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleSendForRepair(breakdown.id)}
                              className="cursor-pointer"
                            >
                              <Tool className="mr-2 h-4 w-4" />
                              <span>Envoyer en réparation</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    ) : filteredBreakdowns.some((b) => b.status === "pending") ? (
                      <td className="p-3">-</td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Breakdown Details Dialog */}
      <BreakdownDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        breakdown={selectedBreakdown}
        onDownloadReport={handleDownloadReport}
        onReturnToSupplier={handleReturnToSupplier}
        onSendForRepair={handleSendForRepair}
        isLoading={isLoading}
      />

      {/* Return to Supplier Dialog */}
      <ReturnToSupplierDialog
        isOpen={isReturnDialogOpen}
        onClose={() => setIsReturnDialogOpen(false)}
        breakdown={selectedBreakdown}
        onConfirm={confirmReturnToSupplier}
        isLoading={isLoading}
      />

      {/* Send for Repair Dialog */}
      <SendForRepairDialog
        isOpen={isRepairDialogOpen}
        onClose={() => setIsRepairDialogOpen(false)}
        breakdown={selectedBreakdown}
        onConfirm={confirmSendForRepair}
        isLoading={isLoading}
      />
    </ResourceManagerLayout>
  )
}

function FrequencyBadge({ frequency, children }: { frequency: string; children: React.ReactNode }) {
  const frequencyClasses = {
    frequent: "bg-amber-100 text-amber-800 border border-amber-200",
    permanent: "bg-red-100 text-red-800 border border-red-200",
    rare: "bg-blue-100 text-blue-800 border border-blue-200",
  }

  return (
    <Badge
      className={`rounded-full px-3 py-1 font-normal ${frequencyClasses[frequency as keyof typeof frequencyClasses]}`}
    >
      {children}
    </Badge>
  )
}

function NatureBadge({ nature, children }: { nature: string; children: React.ReactNode }) {
  const natureClasses = {
    material: "bg-purple-100 text-purple-800 border border-purple-200",
    software: "bg-blue-100 text-blue-800 border border-blue-200",
  }

  const natureIcons = {
    material: <Wrench className="h-3 w-3 mr-1" />,
    software: <FileText className="h-3 w-3 mr-1" />,
  }

  return (
    <Badge
      className={`rounded-full px-3 py-1 font-normal flex items-center ${natureClasses[nature as keyof typeof natureClasses]}`}
    >
      {natureIcons[nature as keyof typeof natureIcons]}
      {children}
    </Badge>
  )
}

function WarrantyBadge({ warranty, children }: { warranty: string; children: React.ReactNode }) {
  const warrantyClasses = {
    valid: "bg-green-100 text-green-800 border border-green-200",
    expired: "bg-red-100 text-red-800 border border-red-200",
  }

  return (
    <Badge
      className={`rounded-full px-3 py-1 font-normal ${warrantyClasses[warranty as keyof typeof warrantyClasses]}`}
    >
      {warranty === "valid" ? "✓ " : "✗ "}
      {children}
    </Badge>
  )
}

function StatusBadge({ status, children }: { status: string; children: React.ReactNode }) {
  const statusClasses = {
    pending: "bg-amber-100 text-amber-800 border border-amber-200",
    waiting_change: "bg-blue-100 text-blue-800 border border-blue-200",
    waiting_repair: "bg-purple-100 text-purple-800 border border-purple-200",
    changed: "bg-green-100 text-green-800 border border-green-200",
    repaired: "bg-green-100 text-green-800 border border-green-200",
  }

  return (
    <Badge className={`rounded-full px-3 py-1 font-normal ${statusClasses[status as keyof typeof statusClasses]}`}>
      {children}
    </Badge>
  )
}
