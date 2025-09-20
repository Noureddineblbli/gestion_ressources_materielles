"use client"

import { useState } from "react"
import { DepartmentHeadLayout } from "@/components/layout/department-head-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, AlertCircle, Clock, RotateCw, RefreshCw, Laptop, Printer, MonitorSmartphone } from "lucide-react"

export default function BreakdownPage() {
  const [activeTab, setActiveTab] = useState("all")

  // Mock data for breakdowns
  const breakdowns = [
    {
      id: "BD-001",
      equipment: "Ordinateur portable HP",
      icon: <Laptop className="h-4 w-4" />,
      location: "Salle 101",
      reportDate: "12/04/2023",
      description: "L'écran ne s'allume pas",
      status: "in-progress",
      statusText: "En cours de réparation",
    },
    {
      id: "BD-002",
      equipment: "Projecteur Epson",
      icon: <MonitorSmartphone className="h-4 w-4" />,
      location: "Salle 205",
      reportDate: "05/04/2023",
      description: "Image floue et couleurs déformées",
      status: "repaired-onsite",
      statusText: "Réparé sur place",
    },
    {
      id: "BD-003",
      equipment: "Tableau interactif",
      icon: <MonitorSmartphone className="h-4 w-4" />,
      location: "Salle 150",
      reportDate: "20/03/2023",
      description: "Ne répond pas au toucher",
      status: "severe",
      statusText: "Panne sévère",
    },
    {
      id: "BD-004",
      equipment: "Imprimante Canon",
      icon: <Printer className="h-4 w-4" />,
      location: "Bureau des enseignants",
      reportDate: "15/03/2023",
      description: "Bourrage papier fréquent",
      status: "repaired",
      statusText: "Réparé",
    },
    {
      id: "BD-005",
      equipment: "Ordinateur portable Dell",
      icon: <Laptop className="h-4 w-4" />,
      location: "Salle 103",
      reportDate: "10/03/2023",
      description: "Problème de démarrage",
      status: "waiting",
      statusText: "En attente",
    },
    {
      id: "BD-006",
      equipment: "Imprimante HP",
      icon: <Printer className="h-4 w-4" />,
      location: "Salle des professeurs",
      reportDate: "05/03/2023",
      description: "Qualité d'impression médiocre",
      status: "replaced",
      statusText: "Remplacée",
    },
  ]

  // Filter breakdowns based on active tab
  const filteredBreakdowns = breakdowns.filter((breakdown) => {
    if (activeTab === "all") return true
    if (activeTab === "waiting" && breakdown.status === "waiting") return true
    if (activeTab === "in-progress" && breakdown.status === "in-progress") return true
    if (activeTab === "repaired-onsite" && breakdown.status === "repaired-onsite") return true
    if (activeTab === "severe" && breakdown.status === "severe") return true
    if (activeTab === "repaired" && breakdown.status === "repaired") return true
    if (activeTab === "replaced" && breakdown.status === "replaced") return true
    return false
  })

  // Render status badge with appropriate styling
  const renderStatusBadge = (status: string, statusText: string) => {
    switch (status) {
      case "waiting":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-200 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-600" />
            {statusText}
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200 flex items-center gap-1.5">
            <RotateCw className="h-3.5 w-3.5 text-yellow-600" />
            {statusText}
          </Badge>
        )
      case "repaired-onsite":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-green-600" />
            {statusText}
          </Badge>
        )
      case "severe":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-red-600" />
            {statusText}
          </Badge>
        )
      case "repaired":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 flex items-center gap-1.5">
            <RefreshCw className="h-3.5 w-3.5 text-green-600" />
            {statusText}
          </Badge>
        )
      case "replaced":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 flex items-center gap-1.5">
            <RefreshCw className="h-3.5 w-3.5 text-blue-600" />
            {statusText}
          </Badge>
        )
      default:
        return <Badge variant="outline">{statusText}</Badge>
    }
  }

  return (
    <DepartmentHeadLayout title="Suivi des Pannes" subtitle="Suivez l'état des pannes signalées">
      <div className="space-y-4">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 w-full max-w-4xl">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="waiting">En attente</TabsTrigger>
            <TabsTrigger value="in-progress">En cours</TabsTrigger>
            <TabsTrigger value="repaired-onsite">Réparées sur place</TabsTrigger>
            <TabsTrigger value="severe">Pannes sévères</TabsTrigger>
            <TabsTrigger value="repaired">Réparées</TabsTrigger>
            <TabsTrigger value="replaced">Remplacées</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Équipement</th>
                    <th className="px-4 py-3 text-left font-medium">Localisation</th>
                    <th className="px-4 py-3 text-left font-medium">Date de signalement</th>
                    <th className="px-4 py-3 text-left font-medium">Description</th>
                    <th className="px-4 py-3 text-left font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBreakdowns.map((breakdown) => (
                    <tr key={breakdown.id} className="border-t">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {breakdown.icon}
                          {breakdown.equipment}
                        </div>
                      </td>
                      <td className="px-4 py-3">{breakdown.location}</td>
                      <td className="px-4 py-3">{breakdown.reportDate}</td>
                      <td className="px-4 py-3">{breakdown.description}</td>
                      <td className="px-4 py-3">{renderStatusBadge(breakdown.status, breakdown.statusText)}</td>
                    </tr>
                  ))}
                  {filteredBreakdowns.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        Aucune panne trouvée pour ce filtre
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DepartmentHeadLayout>
  )
}
