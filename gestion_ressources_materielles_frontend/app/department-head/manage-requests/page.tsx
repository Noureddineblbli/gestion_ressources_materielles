"use client"

import { useState, useEffect } from "react"
import { DepartmentHeadLayout } from "@/components/layout/department-head-layout"
import { Button } from "@/components/ui/button"
import { Send, Pencil, Check, Trash2, Laptop, Printer, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

// Mock data for pending requests
const initialRequests = [
  {
    id: "DEM-2025-001",
    type: "Imprimante",
    icon: <Printer className="h-5 w-5 text-blue-600" />,
    dateCreation: "15 mars 2025",
    quantite: 2,
    specifications: "30 ppm, 1200×1200 dpi",
    teacher: "Martin Dupont",
    note: "Besoin urgent pour le département de mathématiques",
    status: "en_cours",
    dateStatus: "",
  },
  {
    id: "DEM-2025-002",
    type: "Ordinateur",
    icon: <Laptop className="h-5 w-5 text-blue-600" />,
    dateCreation: "16 mars 2025",
    quantite: 1,
    specifications: "Intel Core i7, 16 Go, 512 Go, 15.6 pouces",
    teacher: "Sophie Martin",
    note: "Pour remplacer un ordinateur défectueux",
    status: "en_cours",
    dateStatus: "",
  },
  {
    id: "DEM-2025-003",
    type: "Imprimante",
    icon: <Printer className="h-5 w-5 text-blue-600" />,
    dateCreation: "17 mars 2025",
    quantite: 3,
    specifications: "25 ppm, 600×600 dpi",
    teacher: "Jean Lefebvre",
    note: "Pour la salle des professeurs",
    status: "validee",
    dateStatus: "19 mars 2025",
  },
  {
    id: "DEM-2025-004",
    type: "Ordinateur",
    icon: <Laptop className="h-5 w-5 text-blue-600" />,
    dateCreation: "18 mars 2025",
    quantite: 5,
    specifications: "Intel Core i7, 32 Go, 1 To, 15.6 pouces",
    teacher: "Marie Bernard",
    note: "Budget insuffisant pour cette demande",
    status: "refusee",
    dateStatus: "20 mars 2025",
  },
  {
    id: "DEM-2025-005",
    type: "Imprimante",
    icon: <Printer className="h-5 w-5 text-blue-600" />,
    dateCreation: "19 mars 2025",
    quantite: 1,
    specifications: "25 ppm, 1200×1200 dpi",
    teacher: "Pierre Dubois",
    note: "Pour le laboratoire informatique",
    status: "validee",
    dateStatus: "21 mars 2025",
  },
  {
    id: "DEM-2025-006",
    type: "Ordinateur",
    icon: <Laptop className="h-5 w-5 text-blue-600" />,
    dateCreation: "20 mars 2025",
    quantite: 2,
    specifications: "Intel Core i7, 64 Go, 2 To, 15.6 pouces",
    teacher: "Claire Moreau",
    note: "Pour le secrétariat",
    status: "modifiee",
    dateStatus: "22 mars 2025",
  },
  {
    id: "DEM-2025-007",
    type: "Imprimante",
    icon: <Printer className="h-5 w-5 text-blue-600" />,
    dateCreation: "21 mars 2025",
    quantite: 4,
    specifications: "35 ppm, 2400×1200 dpi",
    teacher: "Lucas Petit",
    note: "Pour le département de design graphique",
    status: "modifiee",
    dateStatus: "23 mars 2025",
  },
  {
    id: "DEM-2025-008",
    type: "Ordinateur",
    icon: <Laptop className="h-5 w-5 text-blue-600" />,
    dateCreation: "22 mars 2025",
    quantite: 3,
    specifications: "Intel Core i7, 16 Go, 512 Go, 17 pouces",
    teacher: "Emma Laurent",
    note: "Pour le département audiovisuel",
    status: "en_cours",
    dateStatus: "",
  },
]

// Get history from localStorage if available
const getHistoryFromStorage = () => {
  if (typeof window !== "undefined") {
    const storedHistory = localStorage.getItem("requestHistory")
    if (storedHistory) {
      return JSON.parse(storedHistory)
    }
  }
  return []
}

// Save history to localStorage
const saveHistoryToStorage = (history) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("requestHistory", JSON.stringify(history))
  }
}

export default function DepartmentHeadManageRequests() {
  const router = useRouter()
  const { toast } = useToast()
  const [requests, setRequests] = useState(initialRequests)
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<any>(null)
  const [deletingRequestId, setDeletingRequestId] = useState<string>("")
  const [sendNote, setSendNote] = useState("")
  const [activeTab, setActiveTab] = useState("en_cours")
  const [requestHistory, setRequestHistory] = useState([])

  // Load history from localStorage on component mount
  useEffect(() => {
    setRequestHistory(getHistoryFromStorage())
  }, [])

  // Form state for editing requests
  const [resourceType, setResourceType] = useState<string>("")
  const [formData, setFormData] = useState({
    // Computer fields
    computerQuantity: "1",
    cpu: "Intel Core i7",
    ram: "16 Go",
    storage: "512 Go",
    screenSize: "15.6 pouces",

    // Printer fields
    printerQuantity: "1",
    printSpeed: "30 ppm",
    resolution: "1200×1200 dpi",

    // Common fields
    teacher: "",
    note: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSendRequests = () => {
    // Create a new history entry
    const currentDate = new Date().toISOString()
    const batchId = `ENV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`

    // Prepare requests for history (remove React elements)
    const requestsForHistory = requests.map((req) => ({
      ...req,
      icon: undefined, // Remove React element
      type: req.type,
      dateCreation: req.dateCreation,
      quantite: req.quantite,
      specifications: req.specifications,
      teacher: req.teacher,
      note: req.note,
      status: req.status,
      dateStatus: req.dateStatus,
    }))

    const newHistoryEntry = {
      batchId,
      dateSent: currentDate,
      note: sendNote,
      requests: requestsForHistory,
    }

    // Update history
    const updatedHistory = [newHistoryEntry, ...requestHistory]
    setRequestHistory(updatedHistory)
    saveHistoryToStorage(updatedHistory)

    // Clear all requests
    setRequests([])

    toast({
      title: "Demandes envoyées",
      description: "Les demandes ont été envoyées au gestionnaire de ressources et ajoutées à l'historique.",
    })

    setIsSendDialogOpen(false)
    setSendNote("")

    // Redirect to history page after a short delay
    setTimeout(() => {
      router.push("/department-head/request-history")
    }, 1500)
  }

  const handleApproveRequest = (id: string) => {
    const currentDate = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    setRequests(
      requests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "validee",
              dateStatus: currentDate,
            }
          : req,
      ),
    )
    toast({
      title: "Demande approuvée",
      description: `La demande ${id} a été approuvée.`,
    })
  }

  const handleConfirmDelete = () => {
    setRequests(requests.filter((req) => req.id !== deletingRequestId))
    setIsDeleteDialogOpen(false)

    toast({
      title: "Demande supprimée",
      description: `La demande ${deletingRequestId} a été supprimée.`,
    })
  }

  const handleDeleteRequest = (id: string) => {
    setDeletingRequestId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleEditRequest = (request: any) => {
    setEditingRequest(request)

    // Set form data based on resource type
    if (request.type === "Ordinateur") {
      const specs = request.specifications.split(", ")
      setResourceType("computer")
      setFormData({
        ...formData,
        computerQuantity: request.quantite.toString(),
        cpu: specs[0] || "Intel Core i7",
        ram: specs[1] || "16 Go",
        storage: specs[2] || "512 Go",
        screenSize: specs[3] || "15.6 pouces",
        teacher: request.teacher,
        note: request.note || "",
      })
    } else {
      const specs = request.specifications.split(", ")
      setResourceType("printer")
      setFormData({
        ...formData,
        printerQuantity: request.quantite.toString(),
        printSpeed: specs[0] || "30 ppm",
        resolution: specs[1] || "1200×1200 dpi",
        teacher: request.teacher,
        note: request.note || "",
      })
    }

    setIsEditDialogOpen(true)
  }

  const handleUpdateRequest = () => {
    const currentDate = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    setRequests(
      requests.map((req) =>
        req.id === editingRequest.id
          ? {
              ...req,
              quantite:
                resourceType === "computer"
                  ? Number.parseInt(formData.computerQuantity)
                  : Number.parseInt(formData.printerQuantity),
              specifications:
                resourceType === "computer"
                  ? `${formData.cpu}, ${formData.ram}, ${formData.storage}, ${formData.screenSize}`
                  : `${formData.printSpeed}, ${formData.resolution}`,
              teacher: formData.teacher,
              note: formData.note,
              status: "modifiee",
              dateStatus: currentDate,
            }
          : req,
      ),
    )
    setIsEditDialogOpen(false)

    toast({
      title: "Demande modifiée",
      description: "La demande a été modifiée avec succès.",
      className: "bg-green-50 border-green-200 text-green-800 animate-in fade-in-50 duration-300",
      icon: <Check className="h-4 w-4 text-green-600" />,
    })
  }

  // Filter requests based on active tab
  const filteredRequests = requests.filter((request) => {
    return request.status === activeTab
  })

  // Get status text based on status code
  const getStatusText = (status: string, date: string) => {
    switch (status) {
      case "modifiee":
        return `Modifiée le ${date}`
      case "validee":
        return `Validée le ${date}`
      case "refusee":
        return `Refusée le ${date}`
      default:
        return ""
    }
  }

  // Get status color based on status code
  const getStatusColor = (status: string) => {
    switch (status) {
      case "modifiee":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "validee":
        return "bg-green-100 text-green-800 border-green-200"
      case "refusee":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return ""
    }
  }

  return (
    <DepartmentHeadLayout title="Gestion des Demandes" subtitle="Gérez les demandes de ressources du département">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-medium">Demandes</h2>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsSendDialogOpen(true)}
            disabled={requests.length === 0}
          >
            <Send className="h-4 w-4" />
            Envoyer demandes
          </Button>

          <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Envoyer les demandes</DialogTitle>
                <DialogDescription>Envoyez les demandes au gestionnaire de ressources</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>Vous êtes sur le point d'envoyer {requests.length} demande(s) au gestionnaire de ressources.</p>

                <div className="mt-4">
                  <Label htmlFor="sendNote" className="mb-2 block">
                    Note d'envoi :
                  </Label>
                  <Textarea
                    id="sendNote"
                    value={sendNote}
                    onChange={(e) => setSendNote(e.target.value)}
                    placeholder="Ajoutez une note pour le gestionnaire de ressources..."
                    rows={4}
                  />
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  Cette action ne peut pas être annulée. Les demandes seront traitées par le gestionnaire de ressources.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSendDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSendRequests} className="bg-blue-600 hover:bg-blue-700">
                  Envoyer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="en_cours" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="en_cours">En cours</TabsTrigger>
          <TabsTrigger value="modifiee">Modifiées</TabsTrigger>
          <TabsTrigger value="refusee">Refusées</TabsTrigger>
          <TabsTrigger value="validee">Validées</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase text-xs tracking-wider">Type</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase text-xs tracking-wider">
                Date de création
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase text-xs tracking-wider">
                Quantité
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase text-xs tracking-wider">
                Spécifications
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase text-xs tracking-wider">
                Enseignant
              </th>
              {activeTab !== "en_cours" && (
                <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase text-xs tracking-wider">
                  Statut
                </th>
              )}
              {activeTab === "en_cours" && (
                <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase text-xs tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={activeTab === "en_cours" ? 6 : 6} className="px-6 py-8 text-center text-gray-500">
                  Aucune demande trouvée
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {request.icon}
                      {request.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{request.dateCreation}</td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-medium">
                      {request.quantite}
                    </div>
                  </td>
                  <td className="px-6 py-4">{request.specifications}</td>
                  <td className="px-6 py-4 text-blue-700">{request.teacher}</td>

                  {activeTab !== "en_cours" && (
                    <td className="px-6 py-4">
                      <Badge className={`${getStatusColor(request.status)}`}>
                        {getStatusText(request.status, request.dateStatus)}
                      </Badge>
                    </td>
                  )}

                  {activeTab === "en_cours" && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600"
                          onClick={() => handleEditRequest(request)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600"
                          onClick={() => handleApproveRequest(request.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600"
                          onClick={() => handleDeleteRequest(request.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Request Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier la demande</DialogTitle>
            <DialogDescription>Modifiez les détails de la demande</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="teacher">Enseignant :</Label>
              <Input
                id="teacher"
                value={formData.teacher}
                onChange={(e) => handleChange("teacher", e.target.value)}
                placeholder="Nom de l'enseignant"
              />
            </div>

            {resourceType === "computer" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="computerQuantity">Quantité</Label>
                  <Input
                    id="computerQuantity"
                    type="number"
                    min="1"
                    value={formData.computerQuantity}
                    onChange={(e) => handleChange("computerQuantity", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cpu">CPU</Label>
                  <Select value={formData.cpu} onValueChange={(value) => handleChange("cpu", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un CPU" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Intel Core i7">Intel Core i7</SelectItem>
                      <SelectItem value="Intel Core i5">Intel Core i5</SelectItem>
                      <SelectItem value="Intel Core i3">Intel Core i3</SelectItem>
                      <SelectItem value="AMD Ryzen 7">AMD Ryzen 7</SelectItem>
                      <SelectItem value="AMD Ryzen 5">AMD Ryzen 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="ram">RAM</Label>
                  <Select value={formData.ram} onValueChange={(value) => handleChange("ram", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la RAM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4 Go">4 Go</SelectItem>
                      <SelectItem value="8 Go">8 Go</SelectItem>
                      <SelectItem value="16 Go">16 Go</SelectItem>
                      <SelectItem value="32 Go">32 Go</SelectItem>
                      <SelectItem value="64 Go">64 Go</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="storage">Disque Dur</Label>
                  <Select value={formData.storage} onValueChange={(value) => handleChange("storage", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le stockage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="128 Go">128 Go</SelectItem>
                      <SelectItem value="256 Go">256 Go</SelectItem>
                      <SelectItem value="512 Go">512 Go</SelectItem>
                      <SelectItem value="1 To">1 To</SelectItem>
                      <SelectItem value="2 To">2 To</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="screenSize">Écran</Label>
                  <Select value={formData.screenSize} onValueChange={(value) => handleChange("screenSize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la taille d'écran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="13 pouces">13 pouces</SelectItem>
                      <SelectItem value="14 pouces">14 pouces</SelectItem>
                      <SelectItem value="15.6 pouces">15.6 pouces</SelectItem>
                      <SelectItem value="17 pouces">17 pouces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {resourceType === "printer" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="printerQuantity">Quantité</Label>
                  <Input
                    id="printerQuantity"
                    type="number"
                    min="1"
                    value={formData.printerQuantity}
                    onChange={(e) => handleChange("printerQuantity", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="printSpeed">Vitesse d'impression</Label>
                  <Select value={formData.printSpeed} onValueChange={(value) => handleChange("printSpeed", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la vitesse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15 ppm">15 ppm</SelectItem>
                      <SelectItem value="20 ppm">20 ppm</SelectItem>
                      <SelectItem value="25 ppm">25 ppm</SelectItem>
                      <SelectItem value="30 ppm">30 ppm</SelectItem>
                      <SelectItem value="35 ppm">35 ppm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="resolution">Résolution</Label>
                  <Select value={formData.resolution} onValueChange={(value) => handleChange("resolution", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la résolution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="600×600 dpi">600×600 dpi</SelectItem>
                      <SelectItem value="1200×600 dpi">1200×600 dpi</SelectItem>
                      <SelectItem value="1200×1200 dpi">1200×1200 dpi</SelectItem>
                      <SelectItem value="2400×1200 dpi">2400×1200 dpi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="note">Note :</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => handleChange("note", e.target.value)}
                placeholder="Ajoutez une note ou des précisions sur cette demande..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateRequest} className="bg-green-600 hover:bg-green-700">
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette demande ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DepartmentHeadLayout>
  )
}
