"use client"

import { useState } from "react"
import { TeacherLayout } from "@/components/layout/teacher-layout"
import { Button } from "@/components/ui/button"
import { Printer, Laptop, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

// Mock data for resources
const initialResources = [
  {
    id: "RES-2025-001",
    type: "Imprimante",
    icon: <Printer className="h-4 w-4" />,
    dateCreation: "29 mars 2025",
    quantite: 2,
    specifications: "30 ppm, 1200x1200 dpi",
    status: "normal", // normal, processing, repaired
  },
  {
    id: "RES-2025-002",
    type: "Ordinateur",
    icon: <Laptop className="h-4 w-4" />,
    dateCreation: "29 mars 2025",
    quantite: 3,
    specifications: "Intel Core i3, 4 Go, 128 Go, 13 pouces",
    status: "normal",
  },
]

export default function TeacherResources() {
  const { toast } = useToast()
  const [resources, setResources] = useState(initialResources)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<any>(null)
  const [issueDescription, setIssueDescription] = useState("")

  const handleReportIssue = (resource: any) => {
    setSelectedResource(resource)
    setIssueDescription("")
    setIsReportDialogOpen(true)
  }

  const handleSubmitIssue = () => {
    if (!issueDescription.trim()) {
      toast({
        title: "Description requise",
        description: "Veuillez fournir une description du problème.",
        variant: "destructive",
      })
      return
    }

    // Update the resource status
    setResources(
      resources.map((res) =>
        res.id === selectedResource.id
          ? {
              ...res,
              status: "processing",
              issue: issueDescription,
            }
          : res,
      ),
    )

    setIsReportDialogOpen(false)

    toast({
      title: "Panne signalée",
      description: "La panne a été signalée avec succès et est maintenant en traitement.",
    })
  }

  return (
    <TeacherLayout title="Ressources" subtitle="Gérez vos ressources">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-medium">Ressources</h2>
          <p className="text-sm text-muted-foreground">{resources.length} éléments</p>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Date d'acquisition</th>
              <th className="px-4 py-3 text-left font-medium">Spécifications</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-t hover:bg-muted/20">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {resource.icon}
                    {resource.type}
                  </div>
                </td>
                <td className="px-4 py-3">{resource.dateCreation}</td>
                <td className="px-4 py-3">{resource.specifications}</td>
                <td className="px-4 py-3">
                  {resource.status === "normal" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleReportIssue(resource)}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Traiter panne
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      disabled
                    >
                      En traitement
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Signaler une panne</DialogTitle>
            <DialogDescription>
              Veuillez décrire le problème avec {selectedResource?.type} ({selectedResource?.id})
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="issue">Description du problème</Label>
              <Textarea
                id="issue"
                placeholder="Décrivez le problème en détail..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                rows={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmitIssue}>Signaler</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TeacherLayout>
  )
}
