"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ResourceManagerLayout } from "@/components/layout/resource-manager-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Download, FileText, FileDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Initial mock data for department requests
const initialDepartmentRequests = [
  {
    id: "req-001",
    department: "Computer Science",
    head: "Dr. Alan Turing",
    status: "sent",
    statusText: "Demande envoyée",
    items: [
      {
        id: "item-001",
        name: "Ordinateur",
        quantity: 15,
        specifications: "16GB RAM, 512GB SSD",
        teacher: "Prof. Ada Lovelace",
      },
      {
        id: "item-002",
        name: "Imprimante",
        quantity: 3,
        specifications: "Laser, couleur",
        teacher: "Prof. Ada Lovelace",
      },
      {
        id: "item-003",
        name: "Tableau",
        quantity: 2,
        specifications: "65 pouces, interactif",
        teacher: "Prof. John McCarthy",
      },
    ],
    date: "2025-03-15",
    notes: "Priorité pour les ordinateurs pour le début du semestre.",
  },
  {
    id: "req-002",
    department: "Mathematics",
    head: "Dr. Katherine Johnson",
    status: "sent",
    statusText: "Demande envoyée",
    items: [
      {
        id: "item-004",
        name: "Calculatrice",
        quantity: 30,
        specifications: "Scientifique",
        teacher: "Prof. Euclid Geometry",
      },
      {
        id: "item-005",
        name: "Ordinateur",
        quantity: 10,
        specifications: "8GB RAM, 256GB SSD",
        teacher: "Prof. Isaac Newton",
      },
    ],
    date: "2025-03-12",
    notes: "Les calculatrices sont nécessaires pour les examens du mois prochain.",
  },
  {
    id: "req-003",
    department: "Physics",
    head: "Dr. Richard Feynman",
    status: "sent",
    statusText: "Demande envoyée",
    items: [
      {
        id: "item-006",
        name: "Oscilloscope",
        quantity: 5,
        specifications: "Digital, 100MHz",
        teacher: "Prof. Albert Einstein",
      },
      { id: "item-007", name: "Kit", quantity: 15, specifications: "Électromagnétisme", teacher: "Prof. Nikola Tesla" },
      { id: "item-008", name: "Capteur", quantity: 8, specifications: "Mouvement", teacher: "Prof. Albert Einstein" },
    ],
    date: "2025-03-18",
    notes: "Matériel nécessaire pour le nouveau laboratoire d'électromagnétisme.",
  },
  {
    id: "req-004",
    department: "Chemistry",
    head: "Dr. Marie Curie",
    status: "sent",
    statusText: "Demande envoyée",
    items: [
      {
        id: "item-009",
        name: "Microscope",
        quantity: 10,
        specifications: "Binoculaire",
        teacher: "Prof. Dmitri Mendeleev",
      },
      {
        id: "item-010",
        name: "Verrerie",
        quantity: 50,
        specifications: "Kit complet",
        teacher: "Prof. Antoine Lavoisier",
      },
      {
        id: "item-011",
        name: "Réactif",
        quantity: 20,
        specifications: "Set standard",
        teacher: "Prof. Dmitri Mendeleev",
      },
    ],
    date: "2025-03-14",
    notes: "Urgent pour les travaux pratiques du prochain trimestre.",
  },
  {
    id: "req-005",
    department: "Biology",
    head: "Dr. Charles Darwin",
    status: "sent",
    statusText: "Demande envoyée",
    items: [
      {
        id: "item-012",
        name: "Microscope",
        quantity: 2,
        specifications: "Électronique",
        teacher: "Prof. Gregor Mendel",
      },
      {
        id: "item-013",
        name: "Incubateur",
        quantity: 3,
        specifications: "Température contrôlée",
        teacher: "Prof. Louis Pasteur",
      },
      {
        id: "item-014",
        name: "Centrifugeuse",
        quantity: 4,
        specifications: "12,000 RPM",
        teacher: "Prof. Gregor Mendel",
      },
    ],
    date: "2025-03-10",
    notes: "Équipement pour le nouveau laboratoire de recherche en biologie moléculaire.",
  },
]

// Function to save offer history to localStorage
const saveOfferHistory = (offer) => {
  try {
    const existingHistory = localStorage.getItem("offerHistory")
    const history = existingHistory ? JSON.parse(existingHistory) : []
    history.push({
      ...offer,
      id: `offer-${Date.now()}`,
      createdAt: new Date().toISOString(),
      departments: initialDepartmentRequests.map((dept) => ({
        name: dept.department,
        head: dept.head,
        itemCount: dept.items.length,
      })),
    })
    localStorage.setItem("offerHistory", JSON.stringify(history))
  } catch (error) {
    console.error("Error saving offer history:", error)
  }
}

export default function DepartmentRequests() {
  const { toast } = useToast()
  const router = useRouter()
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false)
  const [departmentRequests, setDepartmentRequests] = useState([...initialDepartmentRequests])
  const [offerForm, setOfferForm] = useState({
    title: "Offre d'approvisionnement en ressources",
    description: "Demande de devis pour ressources éducatives",
    deadline: "2025-04-16",
    notes: "",
  })
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const downloadLinkRef = useRef(null)

  // Check if all departments have sent their requests
  const allRequestsSent = departmentRequests.every((request) => request.status === "sent")

  const handleChange = (e) => {
    const { name, value } = e.target
    setOfferForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitOffer = () => {
    // Save the offer to history
    saveOfferHistory(offerForm)

    // Reset all department statuses to "pending"
    const resetDepartments = departmentRequests.map((dept) => ({
      ...dept,
      status: "pending",
      statusText: "Pas encore envoyé",
    }))
    setDepartmentRequests(resetDepartments)

    toast({
      title: "Offre créée",
      description: "L'offre fournisseur a été créée avec succès et ajoutée à l'historique.",
    })
    setIsCreateOfferOpen(false)

    // Navigate to offer history page
    router.push("/resource-manager/offer-history")
  }

  const handleDownloadReport = () => {
    toast({
      title: "Téléchargement démarré",
      description: "Le rapport complet est en cours de téléchargement.",
    })
  }

  const openDetails = (department) => {
    setSelectedDepartment(department)
    setIsDetailsOpen(true)
  }

  const handleDownloadPdf = () => {
    if (!selectedDepartment) return

    // Generate PDF content
    const pdfContent = generatePdfContent(selectedDepartment)

    // Create a Blob with the PDF content
    const blob = new Blob([pdfContent], { type: "application/pdf" })

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob)

    // Create a link element and trigger download
    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url
      downloadLinkRef.current.download = `demande-${selectedDepartment.department.toLowerCase().replace(/\s+/g, "-")}.pdf`
      downloadLinkRef.current.click()

      // Clean up the URL object
      setTimeout(() => URL.revokeObjectURL(url), 100)
    }

    toast({
      title: "Téléchargement PDF",
      description: `Le PDF de la demande du département ${selectedDepartment.department} a été téléchargé.`,
    })
  }

  // Function to generate PDF content (simplified for demo)
  const generatePdfContent = (department) => {
    // In a real application, you would use a library like jsPDF or pdfmake
    // This is a simplified version that creates a basic PDF structure
    const header = `%PDF-1.7
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 595 842] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 6 0 R >> >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 1000 >>
stream
BT
/F1 16 Tf
50 800 Td
(Détails de la demande - ${department.department}) Tj
/F1 12 Tf
0 -30 Td
(Date de soumission: ${department.date}) Tj
0 -20 Td
(Chef de département: ${department.head}) Tj
0 -20 Td
(Statut: ${department.statusText}) Tj
0 -30 Td
(Notes: ${department.notes}) Tj
0 -40 Td
(Liste des équipements demandés:) Tj
ET
`

    let itemsContent = ""
    let yPosition = 650

    // Add table header
    itemsContent += `BT
/F1 10 Tf
50 ${yPosition} Td
(Équipement) Tj
150 0 Td
(Quantité) Tj
220 0 Td
(Spécifications) Tj
320 0 Td
(Enseignant) Tj
ET
`
    yPosition -= 20

    // Add table rows
    department.items.forEach((item) => {
      itemsContent += `BT
/F1 10 Tf
50 ${yPosition} Td
(${item.name}) Tj
150 0 Td
(${item.quantity}) Tj
220 0 Td
(${item.specifications}) Tj
320 0 Td
(${item.teacher}) Tj
ET
`
      yPosition -= 20
    })

    const footer = `
endstream
endobj
xref
0 7
0000000000 65535 f
0000000010 00000 n
0000000059 00000 n
0000000118 00000 n
0000000217 00000 n
0000000262 00000 n
0000000319 00000 n
trailer
<< /Size 7 /Root 1 0 R >>
startxref
1319
%%EOF
`

    return header + itemsContent + footer
  }

  return (
    <ResourceManagerLayout
      title="Demandes des départements"
      subtitle="Gérer les demandes de ressources des départements"
    >
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4">Gérer les demandes de ressources des départements</h2>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nom du département</th>
                <th className="px-4 py-3 text-left font-medium">Chef de département</th>
                <th className="px-4 py-3 text-left font-medium">Statut de la demande</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departmentRequests.map((request) => (
                <tr key={request.id} className="border-t">
                  <td className="px-4 py-3">{request.department}</td>
                  <td className="px-4 py-3">{request.head}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span
                        className={`h-2 w-2 rounded-full mr-2 ${
                          request.status === "sent" ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></span>
                      {request.statusText}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" onClick={() => openDetails(request)}>
                      Voir détails
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {allRequestsSent && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Rapport complet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Télécharger un rapport complet des besoins en ressources de tous les départements
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Départements avec demandes :</p>
                  <p className="font-medium">
                    {departmentRequests.length} sur {departmentRequests.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total des articles demandés :</p>
                  <p className="font-medium">
                    {departmentRequests.reduce((total, dept) => total + dept.items.length, 0)}
                  </p>
                </div>
              </div>

              <Button className="w-full" onClick={handleDownloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger le rapport complet
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Créer une offre fournisseur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Créer une offre pour que les fournisseurs répondent aux besoins en ressources
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Types de ressources :</p>
                  <p className="font-medium">
                    {new Set(departmentRequests.flatMap((dept) => dept.items.map((item) => item.name))).size}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget estimé :</p>
                  <p className="font-medium">Contacter le service financier</p>
                </div>
              </div>

              <Dialog open={isCreateOfferOpen} onOpenChange={setIsCreateOfferOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Créer une offre fournisseur
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Créer une offre fournisseur</DialogTitle>
                    <DialogDescription>Créez une nouvelle offre pour les fournisseurs</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre de l'offre</Label>
                      <Input id="title" name="title" value={offerForm.title} onChange={handleChange} />
                      <p className="text-xs text-muted-foreground">Le titre de l'offre fournisseur</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={offerForm.description}
                        onChange={handleChange}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Brève description de la demande d'approvisionnement
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline">Date limite de candidature</Label>
                      <Input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={offerForm.deadline}
                        onChange={handleChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        La date limite pour les fournisseurs de soumettre leurs candidatures
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes supplémentaires</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={offerForm.notes}
                        onChange={handleChange}
                        placeholder="Exigences ou conditions spéciales pour les fournisseurs..."
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Informations supplémentaires pour les fournisseurs (facultatif)
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateOfferOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSubmitOffer}>Soumettre l'offre fournisseur</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Department Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Détails de la demande</DialogTitle>
            <DialogDescription>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-medium">{selectedDepartment?.department}</span>
                <span>•</span>
                <span>Demande soumise le {selectedDepartment?.date}</span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={selectedDepartment?.status === "sent" ? "success" : "outline"}>
                  {selectedDepartment?.statusText}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
                <FileDown className="h-4 w-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-2">Informations du département</h3>
              <Separator className="mb-3" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom du département:</p>
                  <p className="font-medium">{selectedDepartment?.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Chef de département:</p>
                  <p className="font-medium">{selectedDepartment?.head}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-2">Notes du département</h3>
              <Separator className="mb-3" />
              <p className="text-sm border rounded-md p-3 bg-muted/50">
                {selectedDepartment?.notes || "Aucune note fournie."}
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-2">Liste des équipements demandés</h3>
              <Separator className="mb-3" />
              <ScrollArea className="h-64 rounded-md border">
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-2 text-left font-medium">Équipement</th>
                        <th className="pb-2 text-left font-medium">Quantité</th>
                        <th className="pb-2 text-left font-medium">Spécifications</th>
                        <th className="pb-2 text-left font-medium">Enseignant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDepartment?.items.map((item) => (
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="py-3">{item.name}</td>
                          <td className="py-3">{item.quantity}</td>
                          <td className="py-3">{item.specifications}</td>
                          <td className="py-3">{item.teacher}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden download link for PDF */}
      <a ref={downloadLinkRef} style={{ display: "none" }} />
    </ResourceManagerLayout>
  )
}
