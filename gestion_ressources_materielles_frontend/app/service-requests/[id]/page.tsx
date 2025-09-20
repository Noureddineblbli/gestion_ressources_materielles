"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, PenToolIcon as Tool, Wrench, AlertCircle, CheckCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function ServiceRequestDetails() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [request, setRequest] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    // This would be an API call in a real application
    const fetchRequest = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockRequests = [
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
          contactName: "Prof. Sophie Martin",
          contactEmail: "s.martin@univ-paris.fr",
          contactPhone: "+33 1 23 45 67 89",
          location: "Bâtiment A, Salle 203",
          purchaseDate: "15 janvier 2024",
          warrantyEnd: "15 janvier 2027",
          specifications: {
            model: "ThinkPad X1 Carbon Gen 9",
            processor: "Intel Core i7-1165G7",
            ram: "16 GB DDR4",
            storage: "512 GB SSD",
            display: '14" FHD (1920 x 1080) IPS',
            os: "Windows 11 Pro",
            serialNumber: "LNV-X1C9-2024-0078",
          },
          history: [],
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
          contactName: "Marie Dubois",
          contactEmail: "m.dubois@univ-lyon.fr",
          contactPhone: "+33 4 56 78 90 12",
          location: "Bâtiment Administration, Bureau 105",
          purchaseDate: "10 mars 2023",
          warrantyEnd: "10 mars 2026",
          specifications: {
            model: "EcoTank ET-4760",
            type: "Multifonction jet d'encre couleur",
            printSpeed: "15 ppm (noir), 8 ppm (couleur)",
            resolution: "4800 x 1200 dpi",
            connectivity: "Wi-Fi, Ethernet, USB",
            features: "Scanner, Copie, Fax, Recto-verso automatique",
            serialNumber: "EPSON-ET4760-2023-0042",
          },
          history: [
            {
              date: "6 avril 2025",
              status: "confirmed",
              statusText: "Confirmé",
              notes: "Nous confirmons la prise en charge de cette demande. Un technicien vous contactera sous 24h.",
            },
          ],
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
          contactName: "Dr. Pierre Leroy",
          contactEmail: "p.leroy@u-bordeaux.fr",
          contactPhone: "+33 5 56 78 90 12",
          location: "Centre de données, Salle serveurs",
          purchaseDate: "5 mai 2022",
          warrantyEnd: "5 mai 2027",
          specifications: {
            model: "ProLiant DL380 Gen10",
            processor: "2x Intel Xeon Silver 4210 (10 cœurs, 2.2 GHz)",
            ram: "64 GB DDR4 ECC",
            storage: "4x 1.2 TB SAS 10K + 2x 480 GB SSD",
            raidController: "HPE Smart Array P408i-a",
            network: "4x 1GbE + 2x 10GbE",
            serialNumber: "HPE-DL380G10-2022-0015",
          },
          history: [
            {
              date: "11 avril 2025",
              status: "confirmed",
              statusText: "Confirmé",
              notes: "Demande confirmée, intervention planifiée.",
            },
            {
              date: "12 avril 2025",
              status: "in_progress",
              statusText: "En cours",
              notes: "Intervention démarrée. Mise à jour du firmware et vérification des composants en cours.",
            },
          ],
        },
      ]

      const foundRequest = mockRequests.find((r) => r.id === params.id)
      setRequest(foundRequest || null)
      setIsLoading(false)
    }

    fetchRequest()
  }, [params.id])

  const handleUpdateStatus = (newStatus: string) => {
    // In a real app, this would be an API call
    const statusMap: Record<string, string> = {
      confirmed: "Confirmé",
      in_progress: "En cours",
      completed: "Terminé",
    }

    // Use a fixed date format instead of dynamic Date object for SSR consistency
    const formattedDate = "15 avril 2025" // Fixed date for consistency

    const updatedRequest = {
      ...request,
      status: newStatus,
      statusText: statusMap[newStatus],
      history: [
        ...request.history,
        {
          date: formattedDate,
          status: newStatus,
          statusText: statusMap[newStatus],
          notes: notes,
        },
      ],
    }

    setRequest(updatedRequest)
    setNotes("")

    toast({
      title: "Statut mis à jour",
      description: `Le statut de la demande ${request.id} a été mis à jour.`,
    })
  }

  if (isLoading) {
    return (
      <MainLayout title="Détails de la demande" subtitle="Chargement...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    )
  }

  if (!request) {
    return (
      <MainLayout title="Détails de la demande" subtitle="Demande non trouvée">
        <Card>
          <CardContent className="pt-6">
            <p>La demande demandée n'existe pas ou a été supprimée.</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/service-requests")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux demandes
            </Button>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout title={request.resourceName} subtitle={`Référence: ${request.id}`}>
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Détails de la demande</CardTitle>
                <div className="flex items-center gap-2">
                  <TypeBadge type={request.type}>{request.typeText}</TypeBadge>
                  <StatusBadge status={request.status}>{request.statusText}</StatusBadge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

              <div className="p-3 bg-muted rounded-md text-sm mb-6">
                <p className="font-medium">Description du problème:</p>
                <p>{request.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Date d'achat</p>
                  <p className="font-medium">{request.purchaseDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fin de garantie</p>
                  <p className="font-medium">{request.warrantyEnd}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Spécifications techniques</h3>
                <div className="border rounded-md p-4 bg-muted/30">
                  {request.type === "repair" && request.resourceName.includes("Ordinateur") && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Modèle</p>
                        <p className="font-medium">{request.specifications.model}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Processeur</p>
                        <p className="font-medium">{request.specifications.processor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mémoire RAM</p>
                        <p className="font-medium">{request.specifications.ram}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Stockage</p>
                        <p className="font-medium">{request.specifications.storage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Écran</p>
                        <p className="font-medium">{request.specifications.display}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Système d'exploitation</p>
                        <p className="font-medium">{request.specifications.os}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Numéro de série</p>
                        <p className="font-medium">{request.specifications.serialNumber}</p>
                      </div>
                    </div>
                  )}
                  {request.type === "replacement" && request.resourceName.includes("Imprimante") && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Modèle</p>
                        <p className="font-medium">{request.specifications.model}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium">{request.specifications.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Vitesse d'impression</p>
                        <p className="font-medium">{request.specifications.printSpeed}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Résolution</p>
                        <p className="font-medium">{request.specifications.resolution}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Connectivité</p>
                        <p className="font-medium">{request.specifications.connectivity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fonctionnalités</p>
                        <p className="font-medium">{request.specifications.features}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Numéro de série</p>
                        <p className="font-medium">{request.specifications.serialNumber}</p>
                      </div>
                    </div>
                  )}
                  {request.type === "maintenance" && request.resourceName.includes("Serveur") && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Modèle</p>
                        <p className="font-medium">{request.specifications.model}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Processeur</p>
                        <p className="font-medium">{request.specifications.processor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mémoire RAM</p>
                        <p className="font-medium">{request.specifications.ram}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Stockage</p>
                        <p className="font-medium">{request.specifications.storage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Contrôleur RAID</p>
                        <p className="font-medium">{request.specifications.raidController}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Réseau</p>
                        <p className="font-medium">{request.specifications.network}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Numéro de série</p>
                        <p className="font-medium">{request.specifications.serialNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {request.history.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Historique</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">Date</th>
                          <th className="px-4 py-2 text-left font-medium">Statut</th>
                          <th className="px-4 py-2 text-left font-medium">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {request.history.map((entry: any, index: number) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2">{entry.date}</td>
                            <td className="px-4 py-2">{entry.statusText}</td>
                            <td className="px-4 py-2">{entry.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {request.status !== "completed" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Mettre à jour le statut</h3>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Ajouter des notes (optionnel)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    {request.status === "pending" && (
                      <Button onClick={() => handleUpdateStatus("confirmed")} className="gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Confirmer la demande
                      </Button>
                    )}

                    {request.status === "confirmed" && (
                      <Button onClick={() => handleUpdateStatus("in_progress")} className="gap-1">
                        <Wrench className="h-4 w-4" />
                        Démarrer l'intervention
                      </Button>
                    )}

                    {request.status === "in_progress" && (
                      <Button onClick={() => handleUpdateStatus("completed")} className="gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Marquer comme terminé
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{request.contactName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{request.contactEmail}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-medium">{request.contactPhone}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Localisation</p>
                <p className="font-medium">{request.location}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                Contacter le demandeur
              </Button>
              <Button variant="outline" className="w-full">
                Planifier une intervention
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
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
