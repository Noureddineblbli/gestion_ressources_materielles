"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, PenToolIcon as Tool, AlertOctagon, RefreshCw, PackageCheck } from "lucide-react"
import { TeacherLayout } from "@/components/layout/teacher-layout"

export default function BreakdownsPage() {
  const [activeTab, setActiveTab] = useState("all")

  // Mock data for breakdowns
  const breakdowns = [
    {
      id: 1,
      equipment: "Ordinateur portable HP",
      location: "Salle 101",
      reportDate: "12/04/2023",
      description: "L'écran ne s'allume pas",
      status: "en_cours",
      statusText: "En cours de réparation",
      statusIcon: Clock,
      statusColor: "bg-yellow-100 text-yellow-800",
      technician: "Ahmed Benali",
      estimatedCompletion: "20/04/2023",
      notes: "Problème identifié avec la carte graphique. Pièces commandées.",
      lastUpdated: "15/04/2023",
      previousStatus: "en_attent",
    },
    {
      id: 2,
      equipment: "Projecteur Epson",
      location: "Salle 205",
      reportDate: "05/04/2023",
      description: "Image floue et couleurs déformées",
      status: "repare_sur_place",
      statusText: "Réparé sur place",
      statusIcon: CheckCircle,
      statusColor: "bg-green-100 text-green-800",
      technician: "Karim Mansouri",
      completionDate: "05/04/2023",
      notes: "Nettoyage de la lentille et recalibrage des couleurs.",
      lastUpdated: "07/04/2023",
      previousStatus: "en_cours",
    },
    {
      id: 3,
      equipment: "Tableau interactif",
      location: "Salle 150",
      reportDate: "20/03/2023",
      description: "Ne répond pas au toucher",
      status: "panne_severe",
      statusText: "Panne sévère",
      statusIcon: AlertOctagon,
      statusColor: "bg-red-100 text-red-800",
      technician: "Yasmine Tazi",
      notes: "Problème avec le système de détection tactile. Nécessite un remplacement complet.",
    },
    {
      id: 4,
      equipment: "Imprimante Canon",
      location: "Bureau des enseignants",
      reportDate: "15/03/2023",
      description: "Bourrage papier fréquent",
      status: "repare",
      statusText: "Réparé",
      statusIcon: Tool,
      statusColor: "bg-green-100 text-green-800",
      technician: "Mohammed Alaoui",
      completionDate: "22/03/2023",
      notes: "Remplacement du rouleau d'alimentation et nettoyage complet.",
    },
    {
      id: 5,
      equipment: "Ordinateur de bureau Dell",
      location: "Laboratoire informatique",
      reportDate: "10/02/2023",
      description: "Redémarrages aléatoires",
      status: "change",
      statusText: "Remplacé",
      statusIcon: PackageCheck,
      statusColor: "bg-blue-100 text-blue-800",
      technician: "Fatima Zahra",
      completionDate: "01/03/2023",
      replacementModel: "Dell OptiPlex 7090",
      notes: "Problème de carte mère irréparable. Unité remplacée par un nouveau modèle.",
    },
    {
      id: 6,
      equipment: "Système audio",
      location: "Amphithéâtre",
      reportDate: "05/04/2023",
      description: "Grésillements dans les haut-parleurs",
      status: "repare_en_cours",
      statusText: "Réparation en cours",
      statusIcon: RefreshCw,
      statusColor: "bg-purple-100 text-purple-800",
      technician: "Rachid Benjelloun",
      estimatedCompletion: "15/04/2023",
      notes: "Problème d'interférence identifié. Remplacement des câbles en cours.",
    },
    {
      id: 7,
      equipment: "Tablette Samsung",
      location: "Salle 110",
      reportDate: "10/04/2023",
      description: "Ne charge plus correctement",
      status: "en_attent",
      statusText: "En attente",
      statusIcon: Clock,
      statusColor: "bg-blue-100 text-blue-800",
      technician: "Non assigné",
      notes: "En attente d'évaluation par un technicien.",
      lastUpdated: "10/04/2023",
      previousStatus: null,
    },
  ]

  // Filter breakdowns based on active tab only
  const filteredBreakdowns = breakdowns.filter((breakdown) => activeTab === "all" || breakdown.status === activeTab)

  return (
    <TeacherLayout title="Suivi des Pannes" subtitle="Consultez l'état des équipements signalés en panne">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Suivi des Pannes</h1>
        </div>

        <div className="mb-6"></div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="en_attent">En attente</TabsTrigger>
            <TabsTrigger value="en_cours">En cours</TabsTrigger>
            <TabsTrigger value="repare_sur_place">Réparées sur place</TabsTrigger>
            <TabsTrigger value="panne_severe">Pannes sévères</TabsTrigger>
            <TabsTrigger value="repare">Réparées</TabsTrigger>
            <TabsTrigger value="change">Remplacées</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="border rounded-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
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
                    <tr key={breakdown.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3">{breakdown.equipment}</td>
                      <td className="px-4 py-3">{breakdown.location}</td>
                      <td className="px-4 py-3">{breakdown.reportDate}</td>
                      <td className="px-4 py-3">{breakdown.description}</td>
                      <td className="px-4 py-3">
                        <div className={`px-3 py-1 rounded-md inline-flex items-center ${breakdown.statusColor}`}>
                          <breakdown.statusIcon className="h-4 w-4 mr-2" />
                          {breakdown.statusText}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TeacherLayout>
  )
}
