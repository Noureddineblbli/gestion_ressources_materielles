"use client"

import { useState } from "react"
import { DepartmentHeadLayout } from "@/components/layout/department-head-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, Pencil, Trash2, Printer, Laptop, Check, Clock, MessageSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock data for resources
const initialResources = [
  {
    id: "RES-2025-001",
    type: "Imprimante",
    icon: <Printer className="h-4 w-4" />,
    dateCreation: "29 mars 2025",
    quantite: 2,
    specifications: "30 ppm, 1200x1200 dpi",
    status: "En attente de la réunion",
  },
  {
    id: "RES-2025-002",
    type: "Ordinateur",
    icon: <Laptop className="h-4 w-4" />,
    dateCreation: "29 mars 2025",
    quantite: 3,
    specifications: "Intel Core i3, 4 Go, 128 Go, 13 pouces",
    status: "En attente de la réunion",
  },
  {
    id: "RES-2025-003",
    type: "Imprimante",
    icon: <Printer className="h-4 w-4" />,
    dateCreation: "29 mars 2025",
    quantite: 5,
    specifications: "20 ppm, 1200 x 1200 dpi",
    status: "En attente de la réunion",
  },
]

export default function DepartmentHeadDashboard() {
  const { toast } = useToast()
  const [resources, setResources] = useState(initialResources)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeadlineDialogOpen, setIsDeadlineDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null)

  // Deadline state
  const [deadline, setDeadline] = useState("")
  const [deadlineTime, setDeadlineTime] = useState("12:00")
  const [deadlineMessage, setDeadlineMessage] = useState(
    "Veuillez soumettre vos demandes de ressources avant la date limite...",
  )
  const [deadlineSet, setDeadlineSet] = useState(false)
  const [formattedDeadline, setFormattedDeadline] = useState("")
  const [isFormValid, setIsFormValid] = useState(false)

  const [resourceType, setResourceType] = useState<string>("")
  const [editingResource, setEditingResource] = useState<any>(null)
  const [formData, setFormData] = useState({
    // Computer fields
    computerQuantity: "1",
    cpu: "Intel Core i7",
    ram: "16 Go",
    storage: "512 Go",
    screenSize: "15.6 pouces",

    // Printer fields
    printerQuantity: "1",
    printSpeed: "15 ppm",
    resolution: "600 x 600 dpi",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateDeadlineForm = () => {
    return !!deadline && !!deadlineTime && !!deadlineMessage.trim()
  }

  const handleSetDeadline = () => {
    if (!validateDeadlineForm()) return

    const formattedDate = new Date(deadline).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    setFormattedDeadline(`${formattedDate} à ${deadlineTime}`)
    setDeadlineSet(true)
    setIsDeadlineDialogOpen(false)

    toast({
      title: "Date limite mise à jour avec succès!",
      description: `La date limite pour les demandes a été définie au ${formattedDate} à ${deadlineTime}.`,
      className: "bg-green-50 border-green-200 text-green-800 animate-in fade-in-50 duration-300",
      icon: <Check className="h-4 w-4 text-green-600" />,
    })
  }

  const handleAddResource = () => {
    const newResource = {
      id: `RES-2025-${resources.length + 4}`,
      type: resourceType === "computer" ? "Ordinateur" : "Imprimante",
      icon: resourceType === "computer" ? <Laptop className="h-4 w-4" /> : <Printer className="h-4 w-4" />,
      dateCreation: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      quantite:
        resourceType === "computer"
          ? Number.parseInt(formData.computerQuantity)
          : Number.parseInt(formData.printerQuantity),
      specifications:
        resourceType === "computer"
          ? `${formData.cpu}, ${formData.ram}, ${formData.storage}, ${formData.screenSize}`
          : `${formData.printSpeed}, ${formData.resolution}`,
      status: "En attente de la réunion",
    }

    setResources([...resources, newResource])
    setIsAddDialogOpen(false)

    toast({
      title: "Ressource ajoutée avec succès!",
      description: "Votre demande de ressource a été soumise avec succès.",
      className: "bg-green-50 border-green-200 text-green-800 animate-in fade-in-50 duration-300",
      icon: <Check className="h-4 w-4 text-green-600" />,
    })
  }

  const handleEditResource = (resource: any) => {
    setEditingResource(resource)

    // Set form data based on resource type
    if (resource.type === "Ordinateur") {
      const specs = resource.specifications.split(", ")
      setResourceType("computer")
      setFormData({
        ...formData,
        computerQuantity: resource.quantite.toString(),
        cpu: specs[0] || "Intel Core i7",
        ram: specs[1] || "16 Go",
        storage: specs[2] || "512 Go",
        screenSize: specs[3] || "15.6 pouces",
      })
    } else {
      const specs = resource.specifications.split(", ")
      setResourceType("printer")
      setFormData({
        ...formData,
        printerQuantity: resource.quantite.toString(),
        printSpeed: specs[0] || "15 ppm",
        resolution: specs[1] || "600 x 600 dpi",
      })
    }

    setIsEditDialogOpen(true)
  }

  const handleUpdateResource = () => {
    setResources(
      resources.map((res) =>
        res.id === editingResource.id
          ? {
              ...res,
              quantite:
                resourceType === "computer"
                  ? Number.parseInt(formData.computerQuantity)
                  : Number.parseInt(formData.printerQuantity),
              specifications:
                resourceType === "computer"
                  ? `${formData.cpu}, ${formData.ram}, ${formData.storage}, ${formData.screenSize}`
                  : `${formData.printSpeed}, ${formData.resolution}`,
            }
          : res,
      ),
    )
    setIsEditDialogOpen(false)

    toast({
      title: "Ressource modifiée avec succès!",
      description: "La ressource a été modifiée avec succès.",
      className: "bg-green-50 border-green-200 text-green-800 animate-in fade-in-50 duration-300",
      icon: <Check className="h-4 w-4 text-green-600" />,
    })
  }

  const confirmDelete = (id: string) => {
    setResourceToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteResource = () => {
    if (!resourceToDelete) return

    setResources(resources.filter((res) => res.id !== resourceToDelete))
    setIsDeleteDialogOpen(false)
    setResourceToDelete(null)

    toast({
      title: "Ressource supprimée",
      description: "La ressource a été supprimée avec succès.",
      className: "bg-red-50 border-red-200 text-red-800 animate-in fade-in-50 duration-300",
      icon: <Check className="h-4 w-4 text-red-600" />,
    })
  }

  return (
    <DepartmentHeadLayout title="Tableau de bord" subtitle="Gestion des ressources du département">
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Gestion des demandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Définir une date limite pour les demandes de ressources</p>

              {deadlineSet ? (
                <p className="text-sm font-medium">{formattedDeadline}</p>
              ) : (
                <p className="text-sm font-medium">Aucune date limite définie</p>
              )}

              <Dialog open={isDeadlineDialogOpen} onOpenChange={setIsDeadlineDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Définir date limite
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Définir une date limite</DialogTitle>
                    <DialogDescription>
                      Définissez une date limite pour les demandes de ressources des enseignants
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="deadline" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date limite pour les demandes
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className={!deadline ? "border-red-300 focus:border-red-300" : ""}
                      />
                      {!deadline && <p className="text-xs text-red-500">Veuillez sélectionner une date</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="time" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Heure
                      </Label>
                      <Select value={deadlineTime} onValueChange={setDeadlineTime}>
                        <SelectTrigger className={!deadlineTime ? "border-red-300" : ""}>
                          <SelectValue placeholder="Sélectionnez l'heure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="08:00">08:00</SelectItem>
                          <SelectItem value="09:00">09:00</SelectItem>
                          <SelectItem value="10:00">10:00</SelectItem>
                          <SelectItem value="11:00">11:00</SelectItem>
                          <SelectItem value="12:00">12:00</SelectItem>
                          <SelectItem value="13:00">13:00</SelectItem>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="15:00">15:00</SelectItem>
                          <SelectItem value="16:00">16:00</SelectItem>
                          <SelectItem value="17:00">17:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="message" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Message aux enseignants
                      </Label>
                      <Textarea
                        id="message"
                        value={deadlineMessage}
                        onChange={(e) => setDeadlineMessage(e.target.value)}
                        placeholder="Veuillez soumettre vos demandes de ressources avant la date limite..."
                        rows={4}
                        className={!deadlineMessage.trim() ? "border-red-300 focus:border-red-300" : ""}
                      />
                      {!deadlineMessage.trim() && <p className="text-xs text-red-500">Veuillez saisir un message</p>}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeadlineDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSetDeadline}
                      disabled={!validateDeadlineForm()}
                      className={validateDeadlineForm() ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      Définir
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-medium">Ressources</h2>
          <p className="text-sm text-muted-foreground">{resources.length} éléments</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nouvelle Ressource</DialogTitle>
              <DialogDescription>Ajoutez une nouvelle demande de ressource</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="resourceType">Type de ressource :</Label>
                <Select value={resourceType} onValueChange={(value) => setResourceType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer">
                      <div className="flex items-center">
                        <Laptop className="h-4 w-4 mr-2" />
                        Ordinateur
                      </div>
                    </SelectItem>
                    <SelectItem value="printer">
                      <div className="flex items-center">
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimante
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                        <SelectItem value="600 x 600 dpi">600 x 600 dpi</SelectItem>
                        <SelectItem value="1200 x 600 dpi">1200 x 600 dpi</SelectItem>
                        <SelectItem value="1200 x 1200 dpi">1200 x 1200 dpi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddResource} disabled={!resourceType}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Resource Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier la ressource</DialogTitle>
              <DialogDescription>Modifiez les détails de la ressource</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
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
                        <SelectItem value="600 x 600 dpi">600 x 600 dpi</SelectItem>
                        <SelectItem value="1200 x 600 dpi">1200 x 600 dpi</SelectItem>
                        <SelectItem value="1200 x 1200 dpi">1200 x 1200 dpi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateResource} className="bg-green-600 hover:bg-green-700">
                Mettre à jour
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Resource Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette ressource ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cette ressource sera définitivement supprimée de la base de
                données.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteResource} className="bg-red-600 hover:bg-red-700">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Date de création</th>
              <th className="px-4 py-3 text-left font-medium">Quantité</th>
              <th className="px-4 py-3 text-left font-medium">Spécifications</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {resource.icon}
                    {resource.type}
                  </div>
                </td>
                <td className="px-4 py-3">{resource.dateCreation}</td>
                <td className="px-4 py-3">{resource.quantite}</td>
                <td className="px-4 py-3">{resource.specifications}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                    {resource.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleEditResource(resource)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      onClick={() => confirmDelete(resource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DepartmentHeadLayout>
  )
}
