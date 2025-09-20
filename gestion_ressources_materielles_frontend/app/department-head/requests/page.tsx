"use client"

import { useState } from "react"
import { DepartmentHeadLayout } from "@/components/layout/department-head-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Printer, Laptop, X, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data for requests
const initialRequests = [
  {
    id: "DEM-2025-001",
    type: "Imprimante",
    icon: <Printer className="h-4 w-4" />,
    dateCreation: "15 mars 2025",
    quantite: 2,
    specifications: "30 ppm, 1200x1200 dpi",
    status: "validated",
    statusText: "Validé le 20 mars 2025",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    id: "DEM-2025-002",
    type: "Ordinateur",
    icon: <Laptop className="h-4 w-4" />,
    dateCreation: "16 mars 2025",
    quantite: 1,
    specifications: "Intel Core i7, 16 Go, 512 Go, 15.6 pouces",
    status: "pending",
    statusText: "En attente de la réunion",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "DEM-2025-003",
    type: "Imprimante",
    icon: <Printer className="h-4 w-4" />,
    dateCreation: "17 mars 2025",
    quantite: 3,
    specifications: "15 ppm, 600x600 dpi",
    status: "modified",
    statusText: "Modifié le 22 mars 2025",
    statusColor: "bg-orange-100 text-orange-800",
    history: {
      date: "22 mars 2025",
      before: {
        quantite: 1,
        specifications: "15 ppm, 300x300 dpi",
      },
      after: {
        quantite: 3,
        specifications: "15 ppm, 600x600 dpi",
      },
    },
  },
  {
    id: "DEM-2025-004",
    type: "Ordinateur",
    icon: <Laptop className="h-4 w-4" />,
    dateCreation: "18 mars 2025",
    quantite: 5,
    specifications: "AMD Ryzen 5, 8 Go, 256 Go, 14 pouces",
    status: "rejected",
    statusText: "Refusé le 23 mars 2025",
    statusColor: "bg-red-100 text-red-800",
  },
  {
    id: "DEM-2025-005",
    type: "Ordinateur",
    icon: <Laptop className="h-4 w-4" />,
    dateCreation: "19 mars 2025",
    quantite: 2,
    specifications: "Intel Core i5, 8 Go, 256 Go, 13 pouces",
    status: "delivered",
    statusText: "Livré le 25 mars 2025",
    statusColor: "bg-blue-100 text-blue-800",
  },
  {
    id: "DEM-2025-006",
    type: "Ordinateur",
    icon: <Laptop className="h-4 w-4" />,
    dateCreation: "20 mars 2025",
    quantite: 4,
    specifications: "Intel Core i7, 32 Go, 1 To, 17 pouces",
    status: "modified",
    statusText: "Modifié le 26 mars 2025",
    statusColor: "bg-orange-100 text-orange-800",
    history: {
      date: "26 mars 2025",
      before: {
        quantite: 2,
        specifications: "Intel Core i7, 16 Go, 512 Go, 17 pouces",
      },
      after: {
        quantite: 4,
        specifications: "Intel Core i7, 32 Go, 1 To, 17 pouces",
      },
    },
  },
  {
    id: "DEM-2025-007",
    type: "Imprimante",
    icon: <Printer className="h-4 w-4" />,
    dateCreation: "21 mars 2025",
    quantite: 1,
    specifications: "HP LaserJet Pro, 30 ppm, 1200x1200 dpi",
    status: "assigned",
    statusText: "Affecté le 22 mars 2025",
    statusColor: "bg-blue-100 text-blue-800",
    assignment: {
      date: "22 mars 2025",
      resource: "Imprimante HP LaserJet Pro",
      brand: "HP",
      price: "349,99 €",
    },
  },
  {
    id: "DEM-2025-008",
    type: "Ordinateur",
    icon: <Laptop className="h-4 w-4" />,
    dateCreation: "22 mars 2025",
    quantite: 3,
    specifications: "Dell XPS, Intel Core i9, 32 Go, 1 To SSD",
    status: "assigned",
    statusText: "Affecté le 24 mars 2025",
    statusColor: "bg-blue-100 text-blue-800",
    assignment: {
      date: "24 mars 2025",
      resource: "Ordinateur Dell XPS 15",
      brand: "Dell",
      price: "1299,99 €",
    },
  },
]

export default function DepartmentHeadRequests() {
  const [requests] = useState(initialRequests)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false)

  const handleViewHistory = (request: any) => {
    if (request.status === "modified") {
      setSelectedRequest(request)
      setIsHistoryDialogOpen(true)
    }
  }

  const handleViewAssignment = (request: any) => {
    if (request.status === "assigned") {
      setSelectedRequest(request)
      setIsAssignmentDialogOpen(true)
    }
  }

  return (
    <DepartmentHeadLayout title="Suivre demande" subtitle="Suivez l'état de vos demandes de ressources">
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="validated">Validées</TabsTrigger>
          <TabsTrigger value="modified">Modifiées</TabsTrigger>
          <TabsTrigger value="rejected">Refusées</TabsTrigger>
          <TabsTrigger value="delivered">Livrées</TabsTrigger>
          <TabsTrigger value="assigned">Affectées</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <RequestsList requests={requests} onViewHistory={handleViewHistory} onViewAssignment={handleViewAssignment} />
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          <RequestsList
            requests={requests.filter((req) => req.status === "pending")}
            onViewHistory={handleViewHistory}
            onViewAssignment={handleViewAssignment}
          />
        </TabsContent>

        <TabsContent value="validated" className="mt-0">
          <RequestsList
            requests={requests.filter((req) => req.status === "validated")}
            onViewHistory={handleViewHistory}
            onViewAssignment={handleViewAssignment}
          />
        </TabsContent>

        <TabsContent value="modified" className="mt-0">
          <RequestsList
            requests={requests.filter((req) => req.status === "modified")}
            onViewHistory={handleViewHistory}
            onViewAssignment={handleViewAssignment}
          />
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          <RequestsList
            requests={requests.filter((req) => req.status === "rejected")}
            onViewHistory={handleViewHistory}
            onViewAssignment={handleViewAssignment}
          />
        </TabsContent>

        <TabsContent value="delivered" className="mt-0">
          <RequestsList
            requests={requests.filter((req) => req.status === "delivered")}
            onViewHistory={handleViewHistory}
            onViewAssignment={handleViewAssignment}
          />
        </TabsContent>

        <TabsContent value="assigned" className="mt-0">
          <RequestsList
            requests={requests.filter((req) => req.status === "assigned")}
            onViewHistory={handleViewHistory}
            onViewAssignment={handleViewAssignment}
          />
        </TabsContent>
      </Tabs>

      {/* History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-between">
            <DialogHeader className="flex flex-row items-center gap-2 text-left">
              <Clock className="h-5 w-5 text-orange-600" />
              <DialogTitle>Historique des modifications</DialogTitle>
            </DialogHeader>
            <Button variant="ghost" size="icon" onClick={() => setIsHistoryDialogOpen(false)} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-2 mb-4">
            <div className="flex items-center gap-1">
              {selectedRequest?.icon}
              <span>{selectedRequest?.type}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md text-sm bg-orange-100 text-orange-800">
              Modifié le {selectedRequest?.history?.date}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-3">Avant la modification</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Quantité:</p>
                  <p className="font-medium">{selectedRequest?.history?.before.quantite}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Spécifications:</p>
                  <p className="font-medium">{selectedRequest?.history?.before.specifications}</p>
                </div>
              </div>
            </div>

            <div className="border rounded-md p-4 bg-blue-50">
              <h3 className="font-medium mb-3">Après la modification</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Quantité:</p>
                  <p className="font-medium">{selectedRequest?.history?.after.quantite}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Spécifications:</p>
                  <p className="font-medium">{selectedRequest?.history?.after.specifications}</p>
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full mt-4" variant="outline" onClick={() => setIsHistoryDialogOpen(false)}>
            Fermer
          </Button>
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex items-center justify-between">
            <DialogHeader className="flex flex-row items-center gap-2 text-left">
              <FileText className="h-5 w-5 text-blue-600" />
              <DialogTitle>Détails de l'affectation</DialogTitle>
            </DialogHeader>
            <Button variant="ghost" size="icon" onClick={() => setIsAssignmentDialogOpen(false)} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-2 mb-4">
            <div className="flex items-center gap-1">
              {selectedRequest?.icon}
              <span>{selectedRequest?.type}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md text-sm bg-blue-100 text-blue-800">
              Affecté le {selectedRequest?.assignment?.date}
            </span>
          </div>

          <div className="border rounded-md p-4 bg-blue-50">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Ressource:</p>
                <p className="font-medium">{selectedRequest?.assignment?.resource}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Marque:</p>
                <p className="font-medium">{selectedRequest?.assignment?.brand}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prix:</p>
                <p className="font-medium">{selectedRequest?.assignment?.price}</p>
              </div>
            </div>
          </div>

          <Button className="w-full mt-4" variant="outline" onClick={() => setIsAssignmentDialogOpen(false)}>
            Fermer
          </Button>
        </DialogContent>
      </Dialog>
    </DepartmentHeadLayout>
  )
}

interface RequestsListProps {
  requests: any[]
  onViewHistory: (request: any) => void
  onViewAssignment: (request: any) => void
}

function RequestsList({ requests, onViewHistory, onViewAssignment }: RequestsListProps) {
  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Aucune demande trouvée</p>
        </CardContent>
      </Card>
    )
  }

  const handleStatusClick = (request: any) => {
    if (request.status === "modified") {
      onViewHistory(request)
    } else if (request.status === "assigned") {
      onViewAssignment(request)
    }
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Type</th>
            <th className="px-4 py-3 text-left font-medium">Date de création</th>
            <th className="px-4 py-3 text-left font-medium">Quantité</th>
            <th className="px-4 py-3 text-left font-medium">Spécifications</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-t hover:bg-muted/20">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {request.icon}
                  {request.type}
                </div>
              </td>
              <td className="px-4 py-3">{request.dateCreation}</td>
              <td className="px-4 py-3">{request.quantite}</td>
              <td className="px-4 py-3">{request.specifications}</td>
              <td className="px-4 py-3">
                <div
                  className={`px-3 py-1 rounded-md inline-flex items-center ${request.statusColor} ${
                    request.status === "modified" || request.status === "assigned" ? "cursor-pointer" : ""
                  }`}
                  onClick={() => handleStatusClick(request)}
                >
                  {request.status === "modified" && <Clock className="h-3 w-3 mr-1" />}
                  {request.status === "assigned" && <FileText className="h-3 w-3 mr-1" />}
                  {request.statusText}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
