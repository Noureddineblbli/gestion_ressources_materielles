"use client"

import { useState } from "react"
import { ResourceManagerLayout } from "@/components/layout/resource-manager-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Plus,
  Package,
  Settings,
  Phone,
  Mail,
  MapPin,
  Globe,
  User,
  Calendar,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react"
import { AddResourceDialog } from "@/components/add-resource-dialog"
import { AddSupplierDialog } from "@/components/add-supplier-dialog"
import { AssignResourceDialog } from "@/components/assign-resource-dialog"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define resource type
interface Resource {
  id: string
  type: string
  icon: string
  name: string
  brand: string
  deliveryDate: string
  supplier: string
  status: string
  assignment?: string
  assignedTo?: string
  departmentId?: string
  personId?: string
}

// Define supplier type
interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  website: string
  contactPerson: string
  dateAdded: string
}

// Sample data for resources
const initialResources = [
  {
    id: "INV-2025-001",
    type: "Ordinateur",
    icon: "computer",
    name: "Ordinateur portable Dell XPS",
    brand: "Dell",
    deliveryDate: "20 avril 2025",
    supplier: "TechPro Solutions",
    status: "Disponible",
    assignment: "Non assigné",
  },
  {
    id: "INV-2025-002",
    type: "Ordinateur",
    icon: "computer",
    name: "Ordinateur portable Dell XPS",
    brand: "Dell",
    deliveryDate: "20 avril 2025",
    supplier: "TechPro Solutions",
    status: "Assigné",
    assignment: "Computer Science",
    assignedTo: "Dr. John Smith",
    departmentId: "cs",
    personId: "p4",
  },
  {
    id: "INV-2025-003",
    type: "Ordinateur",
    icon: "computer",
    name: "Ordinateur portable Dell XPS",
    brand: "Dell",
    deliveryDate: "20 avril 2025",
    supplier: "TechPro Solutions",
    status: "Assigné",
    assignment: "Computer Science",
    departmentId: "cs",
  },
  {
    id: "INV-2025-004",
    type: "Imprimante",
    icon: "printer",
    name: "Imprimante HP LaserJet",
    brand: "HP",
    deliveryDate: "22 avril 2025",
    supplier: "TechPro Solutions",
    status: "Disponible",
    assignment: "Non assigné",
  },
  {
    id: "INV-2025-005",
    type: "Imprimante",
    icon: "printer",
    name: "Imprimante HP LaserJet",
    brand: "HP",
    deliveryDate: "22 avril 2025",
    supplier: "TechPro Solutions",
    status: "En maintenance",
    assignment: "Non assigné",
  },
  {
    id: "INV-2025-006",
    type: "Ordinateur",
    icon: "computer",
    name: "Ordinateur de bureau HP",
    brand: "HP",
    deliveryDate: "25 avril 2025",
    supplier: "EduSources",
    status: "Assigné",
    assignment: "Mathematics",
    assignedTo: "Dr. Michael Brown",
    departmentId: "math",
    personId: "p2",
  },
  {
    id: "INV-2025-007",
    type: "Imprimante",
    icon: "printer",
    name: "Imprimante Epson EcoTank",
    brand: "Epson",
    deliveryDate: "25 avril 2025",
    supplier: "EduSources",
    status: "Assigné",
    assignment: "Physics Department",
    departmentId: "physics",
  },
  {
    id: "INV-2025-008",
    type: "Ordinateur",
    icon: "computer",
    name: "Ordinateur portable Lenovo ThinkPad",
    brand: "Lenovo",
    deliveryDate: "18 avril 2025",
    supplier: "ScienceEquip",
    status: "Disponible",
    assignment: "Non assigné",
  },
]

// Sample data for suppliers
const initialSuppliers = [
  {
    id: "sup-001",
    name: "TechPro Solutions",
    email: "contact@techpro.fr",
    phone: "+33 1 23 45 67 89",
    address: "15 Rue de l'Innovation, 75001 Paris",
    website: "https://techpro.fr",
    contactPerson: "Jean Dupont",
    dateAdded: "10 janvier 2025",
  },
  {
    id: "sup-002",
    name: "EduSources",
    email: "contact@edusources.fr",
    phone: "+33 1 98 76 54 32",
    address: "42 Avenue de l'Éducation, 69002 Lyon",
    website: "https://edusources.fr",
    contactPerson: "Marie Martin",
    dateAdded: "15 février 2025",
  },
  {
    id: "sup-003",
    name: "ScienceEquip",
    email: "info@scienceequip.fr",
    phone: "+33 3 45 67 89 10",
    address: "8 Boulevard des Sciences, 33000 Bordeaux",
    website: "https://scienceequip.fr",
    contactPerson: "Pierre Leroy",
    dateAdded: "5 mars 2025",
  },
]

// Department mapping
const departmentNames: Record<string, string> = {
  math: "Mathematics",
  cs: "Computer Science",
  physics: "Physics Department",
}

export default function Delivery() {
  const [activeTab, setActiveTab] = useState("reception")
  const [resourcesTableTab, setResourcesTableTab] = useState("resources")
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false)
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const { toast } = useToast()

  const handleAddResource = (newResource: Omit<Resource, "status" | "deliveryDate">) => {
    // Format current date in French
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
    const formattedDate = today.toLocaleDateString("fr-FR", options)

    // Create new resource with "Disponible" status
    const resourceToAdd: Resource = {
      ...newResource,
      deliveryDate: formattedDate,
      status: "Disponible",
      assignment: "Non assigné",
    }

    // Add to resources list
    setResources([resourceToAdd, ...resources])

    // Close dialog
    setResourceDialogOpen(false)

    // Show success toast
    toast({
      title: "Ressource ajoutée",
      description: `${newResource.name} a été ajouté avec succès.`,
    })
  }

  const handleAddSupplier = (supplierData: {
    name: string
    email: string
    phone: string
    address: string
    website: string
    contactPerson: string
  }) => {
    // Format current date in French
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
    const formattedDate = today.toLocaleDateString("fr-FR", options)

    // Create new supplier with ID and date
    const newSupplier: Supplier = {
      id: `sup-${suppliers.length + 1}`.padStart(7, "0"),
      ...supplierData,
      dateAdded: formattedDate,
    }

    // Add to suppliers list
    setSuppliers([...suppliers, newSupplier])

    // Close dialog
    setSupplierDialogOpen(false)

    // Show success toast
    toast({
      title: "Fournisseur ajouté",
      description: `${supplierData.name} a été ajouté avec succès.`,
    })
  }

  const handleOpenAssignDialog = (resource: Resource) => {
    setSelectedResource(resource)
    setAssignDialogOpen(true)
  }

  const handleAssignResource = (assignment: {
    resourceId: string
    departmentId: string
    personId?: string
    assignToEntireDepartment: boolean
  }) => {
    // Find the resource to update
    const updatedResources = resources.map((resource) => {
      if (resource.id === assignment.resourceId) {
        const departmentName = departmentNames[assignment.departmentId] || assignment.departmentId

        // Get person name if assigned to a specific person
        let personName = ""
        if (assignment.personId) {
          // This is a simplified approach - in a real app, you'd look up the person's name
          if (assignment.personId === "p1") personName = "Dr. Sarah Wilson"
          else if (assignment.personId === "p2") personName = "Dr. Michael Brown"
          else if (assignment.personId === "p3") personName = "Dr. Emily Johnson"
          else if (assignment.personId === "p4") personName = "Dr. John Smith"
          else if (assignment.personId === "p5") personName = "Dr. Lisa Chen"
          else if (assignment.personId === "p6") personName = "Dr. Robert Davis"
          else if (assignment.personId === "p7") personName = "Dr. James Miller"
          else if (assignment.personId === "p8") personName = "Dr. Patricia White"
          else if (assignment.personId === "p9") personName = "Dr. Thomas Lee"
        }

        return {
          ...resource,
          status: "Assigné",
          assignment: departmentName,
          assignedTo: assignment.personId ? personName : undefined,
          departmentId: assignment.departmentId,
          personId: assignment.personId,
        }
      }
      return resource
    })

    setResources(updatedResources)

    // Show success toast
    toast({
      title: "Ressource assignée",
      description: `La ressource a été assignée avec succès.`,
    })
  }

  const handleDeleteResource = (resourceId: string) => {
    // Filter out the resource to delete
    const updatedResources = resources.filter((resource) => resource.id !== resourceId)
    setResources(updatedResources)

    // Show success toast
    toast({
      title: "Ressource supprimée",
      description: `La ressource a été supprimée avec succès.`,
    })
  }

  return (
    <ResourceManagerLayout title="Gérer la réception et l'assignation des ressources livrées" subtitle="">
      <div className="space-y-6">
        {/* Main Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <Tabs defaultValue="reception" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="reception" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Réception des ressources
              </TabsTrigger>
              <TabsTrigger value="assignment" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Gestion et assignation
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Reception Tab Content */}
        {activeTab === "reception" && (
          <>
            {/* Content Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Réception des ressources</h2>
              <Button className="flex items-center gap-2" onClick={() => setResourceDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Ajouter une ressource
              </Button>
            </div>

            {/* Resources/Suppliers Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="flex justify-between items-center border-b">
                <div className="px-4 py-3 font-medium">
                  <Tabs defaultValue="resources" className="w-full" onValueChange={setResourcesTableTab}>
                    <TabsList className="bg-transparent p-0 h-auto">
                      <TabsTrigger
                        value="resources"
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                      >
                        Ressources livrées récentes
                      </TabsTrigger>
                      <TabsTrigger
                        value="suppliers"
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                      >
                        Fournisseurs
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="resources" className="mt-0 p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/40">
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                N° d'inventaire
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nom</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Marque</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Date de livraison
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Fournisseur
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Statut</th>
                            </tr>
                          </thead>
                          <tbody>
                            {resources.map((resource) => (
                              <tr key={resource.id} className="border-b hover:bg-muted/50">
                                <td className="px-4 py-3 text-sm">{resource.id}</td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    {resource.icon === "computer" ? (
                                      <div className="text-blue-600">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <rect width="14" height="8" x="5" y="2" rx="2" />
                                          <rect width="20" height="8" x="2" y="14" rx="2" />
                                          <path d="M6 18h2" />
                                          <path d="M12 18h6" />
                                        </svg>
                                      </div>
                                    ) : (
                                      <div className="text-purple-600">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <polyline points="6 9 6 2 18 2 18 9" />
                                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                          <rect width="12" height="8" x="6" y="14" />
                                        </svg>
                                      </div>
                                    )}
                                    {resource.type}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">{resource.name}</td>
                                <td className="px-4 py-3 text-sm">{resource.brand}</td>
                                <td className="px-4 py-3 text-sm">{resource.deliveryDate}</td>
                                <td className="px-4 py-3 text-sm">{resource.supplier}</td>
                                <td className="px-4 py-3 text-sm">
                                  <StatusBadge status={resource.status} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>

                    <TabsContent value="suppliers" className="mt-0 p-0">
                      <div className="flex justify-end p-4">
                        <Button
                          size="sm"
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => setSupplierDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                          Ajouter un fournisseur
                        </Button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/40">
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nom</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Téléphone
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Adresse</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Site web
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Responsable
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Date d'ajout
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {suppliers.map((supplier) => (
                              <tr key={supplier.id} className="border-b hover:bg-muted/50">
                                <td className="px-4 py-3 text-sm font-medium">{supplier.name}</td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    {supplier.email}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    {supplier.phone}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    {supplier.address}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <a
                                      href={supplier.website}
                                      className="text-blue-600 hover:underline"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {supplier.website.replace("https://", "")}
                                    </a>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    {supplier.contactPerson}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    {supplier.dateAdded}
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
              </div>
            </div>
          </>
        )}

        {/* Assignment Tab Content */}
        {activeTab === "assignment" && (
          <>
            {/* Content Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Gestion des ressources</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Rechercher..." className="w-[250px] pl-8" />
                </div>
                <Select defaultValue="all-types">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">Tous les types</SelectItem>
                    <SelectItem value="computer">Ordinateur</SelectItem>
                    <SelectItem value="printer">Imprimante</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-statuses">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-statuses">Tous les statuts</SelectItem>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="assigned">Assigné</SelectItem>
                    <SelectItem value="maintenance">En maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignment Table */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">N° d'inventaire</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Ressource</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Statut</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Assignation</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((resource) => (
                      <tr key={resource.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">{resource.id}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            {resource.icon === "computer" ? (
                              <div className="text-blue-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <rect width="14" height="8" x="5" y="2" rx="2" />
                                  <rect width="20" height="8" x="2" y="14" rx="2" />
                                  <path d="M6 18h2" />
                                  <path d="M12 18h6" />
                                </svg>
                              </div>
                            ) : (
                              <div className="text-purple-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="6 9 6 2 18 2 18 9" />
                                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                  <rect width="12" height="8" x="6" y="14" />
                                </svg>
                              </div>
                            )}
                            {resource.type}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            {resource.name}
                            <div className="text-xs text-muted-foreground">{resource.brand}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <StatusBadge status={resource.status} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            {resource.assignment}
                            {resource.assignedTo && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <User className="h-3 w-3" /> {resource.assignedTo}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="link" className="h-auto p-0 text-amber-600">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {resource.status === "Disponible" || resource.status === "En maintenance" ? (
                                <>
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleOpenAssignDialog(resource)}
                                  >
                                    <UserPlus className="h-4 w-4" />
                                    Assigner
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                                    onClick={() => handleDeleteResource(resource.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <>
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleOpenAssignDialog(resource)}
                                  >
                                    <Settings className="h-4 w-4" />
                                    Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                                    onClick={() => handleDeleteResource(resource.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Resource Dialog */}
      <AddResourceDialog
        open={resourceDialogOpen}
        onOpenChange={setResourceDialogOpen}
        onAddResource={handleAddResource}
      />

      {/* Add Supplier Dialog */}
      <AddSupplierDialog
        open={supplierDialogOpen}
        onOpenChange={setSupplierDialogOpen}
        onAddSupplier={handleAddSupplier}
      />

      {/* Assign Resource Dialog */}
      <AssignResourceDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        resource={selectedResource}
        onAssign={handleAssignResource}
      />
    </ResourceManagerLayout>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Disponible":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          Disponible
        </span>
      )
    case "Assigné":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          Assigné
        </span>
      )
    case "En maintenance":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          En maintenance
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
          {status}
        </span>
      )
  }
}
