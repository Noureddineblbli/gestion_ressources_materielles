"use client"

import { useState } from "react"
import { TeacherLayout } from "@/components/layout/teacher-layout"
import { Button } from "@/components/ui/button"
import { Printer, Laptop, Pencil, Trash2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

// Types
type DeviceType = "computer" | "printer"

interface Resource {
  id: string
  type: DeviceType
  dateCreation: string
  quantite: number
  specifications: string
  status: string
}

export default function TeacherDashboard() {
  const { toast } = useToast()
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "RES-2025-001",
      type: "printer",
      dateCreation: "29 mars 2025",
      quantite: 2,
      specifications: "30 ppm, 1200x1200 dpi",
      status: "En attente de la réunion",
    },
    {
      id: "RES-2025-002",
      type: "computer",
      dateCreation: "29 mars 2025",
      quantite: 3,
      specifications: "Intel Core i3, 4 Go, 128 Go, 13 pouces",
      status: "En attente de la réunion",
    },
    {
      id: "RES-2025-003",
      type: "printer",
      dateCreation: "29 mars 2025",
      quantite: 5,
      specifications: "20 ppm, 1200 x 1200 dpi",
      status: "En attente de la réunion",
    },
  ])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [resourceType, setResourceType] = useState<DeviceType | "">("")
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

  // First, add a new state to track the resource to be deleted
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddResource = () => {
    if (!resourceType) {
      toast({
        title: "Type requis",
        description: "Veuillez sélectionner un type d'appareil.",
        variant: "destructive",
      })
      return
    }

    const newResource: Resource = {
      id: `RES-2025-${resources.length + 4}`,
      type: resourceType,
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
    setResourceType("")

    toast({
      title: "Demande ajoutée",
      description: "Votre demande de ressource a été soumise avec succès.",
    })
  }

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource)

    // Set form data based on resource type
    if (resource.type === "computer") {
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
    if (!editingResource) return

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
      title: "Demande modifiée",
      description: "La demande a été modifiée avec succès.",
    })
  }

  // Modify the handleDeleteResource function to only delete when confirmed
  const handleDeleteResource = (id: string) => {
    setResources(resources.filter((res) => res.id !== id))

    toast({
      title: "Demande supprimée",
      description: "La demande a été supprimée avec succès.",
    })
    setIsDeleteDialogOpen(false)
    setResourceToDelete(null)
  }

  // Add a function to open the delete confirmation dialog
  const confirmDelete = (id: string) => {
    setResourceToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  return (
    <TeacherLayout title="Ajouter une demande" subtitle="Créez et gérez vos demandes de ressources">
      <div className="flex justify-end mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nouvelle Demande</DialogTitle>
              <DialogDescription>Ajoutez une nouvelle demande de ressource</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="resourceType">Type de ressource :</Label>
                <Select value={resourceType} onValueChange={(value) => setResourceType(value as DeviceType)}>
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
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3.5 text-left font-medium text-gray-600 dark:text-gray-200">Type</th>
              <th className="px-4 py-3.5 text-left font-medium text-gray-600 dark:text-gray-200">Date de création</th>
              <th className="px-4 py-3.5 text-left font-medium text-gray-600 dark:text-gray-200">Quantité</th>
              <th className="px-4 py-3.5 text-left font-medium text-gray-600 dark:text-gray-200">Spécifications</th>
              <th className="px-4 py-3.5 text-left font-medium text-gray-600 dark:text-gray-200">Status</th>
              <th className="px-4 py-3.5 text-left font-medium text-gray-600 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {resource.type === "computer" ? (
                      <Laptop className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    ) : (
                      <Printer className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    )}
                    {resource.type === "computer" ? "Ordinateur" : "Imprimante"}
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{resource.dateCreation}</td>
                <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{resource.quantite}</td>
                <td className="px-4 py-4 text-gray-700 dark:text-gray-300">{resource.specifications}</td>
                <td className="px-4 py-4">
                  <Badge className="bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                    {resource.status}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                      onClick={() => handleEditResource(resource)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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

      {/* Edit Resource Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier la demande</DialogTitle>
            <DialogDescription>Modifiez les détails de la demande</DialogDescription>
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
            <Button onClick={handleUpdateResource}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette demande ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={() => resourceToDelete && handleDeleteResource(resourceToDelete)}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TeacherLayout>
  )
}
