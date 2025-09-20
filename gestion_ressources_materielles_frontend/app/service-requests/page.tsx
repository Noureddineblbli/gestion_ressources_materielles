"use client"

import type React from "react"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Clock, Eye, PenToolIcon as Tool, Wrench } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Initial service requests data
const initialServiceRequests = [
  {
    id: "SRV-2025-001",
    resourceId: "INV-2025-008",
    resourceName: "Ordinateur portable Lenovo ThinkPad",
    university: "Université de Paris",
    department: "Informatique",
    requestDate: "2 avril 2025",
    type: "repair",
    typeText: "Réparation",
    description: "L'écran affiche des lignes horizontales et s'éteint parfois de façon aléatoire.",
    status: "pending",
    statusText: "En attente",
    initialDescription: "Écran bleu fréquent lors de l'utilisation de logiciels spécifiques",
    breakdownExplanation: "Défaillance détectée dans le système d'alimentation",
    occurrenceDate: "06/04/2025 03:57",
    frequency: "Fréquente",
    breakdownType: "Matériel",
  },
  {
    id: "SRV-2025-002",
    resourceId: "INV-2025-007",
    resourceName: "Imprimante Epson EcoTank",
    university: "Université de Lyon",
    department: "Administration",
    requestDate: "5 avril 2025",
    type: "replacement",
    typeText: "Remplacement",
    description: "L'imprimante ne s'allume plus du tout malgré plusieurs tentatives.",
    status: "confirmed",
    statusText: "Confirmé",
  },
  {
    id: "SRV-2025-003",
    resourceId: "INV-2025-006",
    resourceName: "Serveur HP ProLiant",
    university: "Université de Bordeaux",
    department: "Recherche",
    requestDate: "10 avril 2025",
    type: "maintenance",
    typeText: "Maintenance",
    description: "Maintenance préventive requise selon le calendrier d'entretien.",
    status: "in_progress",
    statusText: "En cours",
  },
]

export default function ServiceRequests() {
  const [requests, setRequests] = useState(initialServiceRequests)
  const [activeTab, setActiveTab] = useState("pending")
  const { toast } = useToast()

  // Update requests state and handle tab switching
  const updateRequestStatus = (requestId: string, newStatus: string) => {
    setRequests((prevRequests) => {
      return prevRequests.map((req) => {
        if (req.id === requestId) {
          const statusTextMap: Record<string, string> = {
            pending: "En attente",
            confirmed: "Confirmé",
            in_progress: "En cours",
            completed: "Terminé",
          }

          return {
            ...req,
            status: newStatus,
            statusText: statusTextMap[newStatus],
          }
        }
        return req
      })
    })

    // Switch to the appropriate tab after status update
    setActiveTab(newStatus)

    // Show toast notification
    const statusMessages: Record<string, string> = {
      confirmed: "La demande a été confirmée",
      in_progress: "L'intervention a été démarrée",
      completed: "La demande a été marquée comme terminée",
    }

    toast({
      title: "Statut mis à jour",
      description: statusMessages[newStatus] || `Le statut de la demande ${requestId} a été mis à jour.`,
    })
  }

  return (
    <MainLayout title="Demandes de maintenance" subtitle="Gérez les demandes de réparation et de remplacement">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
          <TabsTrigger value="in_progress">En cours</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          <ServiceRequestsList
            requests={requests.filter((req) => req.status === "pending")}
            updateRequestStatus={updateRequestStatus}
          />
        </TabsContent>

        <TabsContent value="confirmed" className="mt-0">
          <ServiceRequestsList
            requests={requests.filter((req) => req.status === "confirmed")}
            updateRequestStatus={updateRequestStatus}
          />
        </TabsContent>

        <TabsContent value="in_progress" className="mt-0">
          <ServiceRequestsList
            requests={requests.filter((req) => req.status === "in_progress")}
            updateRequestStatus={updateRequestStatus}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <ServiceRequestsList
            requests={requests.filter((req) => req.status === "completed")}
            updateRequestStatus={updateRequestStatus}
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}

function ServiceRequestsList({
  requests,
  updateRequestStatus,
}: {
  requests: typeof initialServiceRequests
  updateRequestStatus: (requestId: string, newStatus: string) => void
}) {
  const { toast } = useToast()
  const router = useRouter()
  const [openDialogId, setOpenDialogId] = useState<string | null>(null)

  const handleConfirm = (requestId: string) => {
    updateRequestStatus(requestId, "confirmed")
    setOpenDialogId(null)
  }

  const handleStartIntervention = (requestId: string) => {
    updateRequestStatus(requestId, "in_progress")
  }

  const handleComplete = (requestId: string) => {
    updateRequestStatus(requestId, "completed")
  }

  const viewDetails = (requestId: string) => {
    router.push(`/service-requests/${requestId}`)
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Aucune demande trouvée</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{request.resourceName}</CardTitle>
              <div className="flex items-center gap-2">
                <TypeBadge type={request.type}>{request.typeText}</TypeBadge>
                <StatusBadge status={request.status}>{request.statusText}</StatusBadge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Référence</p>
                <p className="font-medium">{request.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Université</p>
                <p className="font-medium">{request.university}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Département</p>
                <p className="font-medium">{request.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de demande</p>
                <p className="font-medium">{request.requestDate}</p>
              </div>
            </div>

            <div className="p-3 bg-muted rounded-md text-sm mb-4">
              <p className="font-medium">Description du problème:</p>
              <p>{request.description}</p>
            </div>

            <div className="flex justify-end gap-2">
              {/* Pending status actions */}
              {request.status === "pending" && (
                <Dialog
                  open={openDialogId === request.id}
                  onOpenChange={(open) => (open ? setOpenDialogId(request.id) : setOpenDialogId(null))}
                >
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm" className="gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Confirmer la demande
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmer la demande de maintenance</DialogTitle>
                      <DialogDescription>
                        Vous êtes sur le point de confirmer la prise en charge de cette demande.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setOpenDialogId(null)}>
                        Annuler
                      </Button>
                      <Button onClick={() => handleConfirm(request.id)}>Confirmer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Confirmed status actions */}
              {request.status === "confirmed" && request.type === "repair" && (
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleStartIntervention(request.id)}
                >
                  <Wrench className="h-4 w-4" />
                  Démarrer l'intervention
                </Button>
              )}

              {request.status === "confirmed" && request.type === "replacement" && (
                <Button variant="default" size="sm" className="gap-1" onClick={() => handleComplete(request.id)}>
                  <CheckCircle className="h-4 w-4" />
                  Marquer comme terminé
                </Button>
              )}

              {/* In progress status actions */}
              {request.status === "in_progress" && (
                <Button variant="default" size="sm" className="gap-1" onClick={() => handleComplete(request.id)}>
                  <CheckCircle className="h-4 w-4" />
                  Marquer comme terminé
                </Button>
              )}

              {/* View details button for all statuses */}
              <Button variant="outline" size="sm" className="gap-1" onClick={() => viewDetails(request.id)}>
                <Eye className="h-4 w-4" />
                Voir les détails
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TypeBadge({ type, children }: { type: string; children: React.ReactNode }) {
  const typeClasses = {
    repair: "bg-amber-100 text-amber-800",
    replacement: "bg-purple-100 text-purple-800",
    maintenance: "bg-blue-100 text-blue-800",
  }

  const typeIcons = {
    repair: <Tool className="h-3 w-3 mr-1" />,
    replacement: <AlertCircle className="h-3 w-3 mr-1" />,
    maintenance: <Wrench className="h-3 w-3 mr-1" />,
  }

  return (
    <Badge className={`status-badge flex items-center ${typeClasses[type as keyof typeof typeClasses]}`}>
      {typeIcons[type as keyof typeof typeIcons]}
      {children}
    </Badge>
  )
}

function StatusBadge({ status, children }: { status: string; children: React.ReactNode }) {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    in_progress: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
  }

  const statusIcons = {
    pending: <Clock className="h-3 w-3 mr-1" />,
    confirmed: <CheckCircle className="h-3 w-3 mr-1" />,
    in_progress: <Tool className="h-3 w-3 mr-1" />,
    completed: <CheckCircle className="h-3 w-3 mr-1" />,
  }

  return (
    <Badge className={`status-badge flex items-center ${statusClasses[status as keyof typeof statusClasses]}`}>
      {statusIcons[status as keyof typeof statusIcons]}
      {children}
    </Badge>
  )
}
