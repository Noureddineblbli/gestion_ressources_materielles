"use client"

import { useState, useEffect } from "react" // Add useEffect
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText, Info } from "lucide-react"
import { SubmitOfferDialog } from "@/components/submit-offer-dialog"
import { useAuth } from "@/lib/auth"
import { TenderDetailsDialog } from "@/components/tender-details-dialog"

const tenders = [
  {
    id: "OFR-2025-001",
    title: "Équipement informatique",
    description: "Fourniture d'ordinateurs portables, imprimantes et accessoires pour le département d'informatique.",
    items: [
      { name: "Ordinateurs portables", quantity: 20, specs: "i7, 16GB RAM, 512GB SSD" },
      { name: "Imprimantes laser", quantity: 5, specs: "Couleur, recto-verso" },
      { name: 'Écrans 27"', quantity: 15, specs: "4K, IPS" },
    ],
    deadline: "15 mai 2025",
    conditions: "Livraison sous 30 jours, garantie 3 ans minimum",
    university: "Université de Paris",
  },
  {
    id: "OFR-2025-002",
    title: "Mobilier de laboratoire",
    description: "Fourniture de mobilier spécialisé pour les nouveaux laboratoires de chimie.",
    items: [
      { name: "Paillasses", quantity: 10, specs: "Résistantes aux produits chimiques" },
      { name: "Tabourets de laboratoire", quantity: 30, specs: "Hauteur réglable" },
      { name: "Armoires de sécurité", quantity: 5, specs: "Pour produits chimiques" },
    ],
    deadline: "22 mai 2025",
    conditions: "Installation incluse, conformité aux normes de sécurité",
    university: "Université de Lyon",
  },
  {
    id: "OFR-2025-003",
    title: "Matériel audiovisuel",
    description: "Équipement audiovisuel pour les amphithéâtres et salles de conférence.",
    items: [
      { name: "Vidéoprojecteurs", quantity: 8, specs: "4K, 5000 lumens" },
      { name: "Systèmes de sonorisation", quantity: 8, specs: "Complet avec micros sans fil" },
      { name: "Écrans de projection", quantity: 8, specs: "Motorisés, 3m x 2m" },
    ],
    deadline: "30 mai 2025",
    conditions: "Installation et formation incluses",
    university: "Université de Bordeaux",
  },
]

export default function Tenders() {
  const { checkProfileComplete } = useAuth()
  const [selectedTender, setSelectedTender] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [viewTender, setViewTender] = useState<any>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmitOffer = (tender: any) => {
    if (checkProfileComplete()) {
      setSelectedTender(tender)
      setIsDialogOpen(true)
    }
  }

  // Use a fixed publication date for SSR consistency
  const publicationDate = "1 avril 2025"

  return (
    <MainLayout title="Offres en cours" subtitle="Consultez les appels d'offres des universités">
      <div className="grid gap-6">
        {tenders.map((tender) => (
          <Card key={tender.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{tender.title}</CardTitle>
                  <CardDescription>
                    Réf: {tender.id} • {tender.university}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Date limite: {tender.deadline}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{tender.description}</p>

              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <FileText className="h-4 w-4" /> Équipements demandés
                </h4>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium">Équipement</th>
                        <th className="px-4 py-2 text-left font-medium">Quantité</th>
                        <th className="px-4 py-2 text-left font-medium">Spécifications</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tender.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{item.name}</td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2">{item.specs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-start gap-1 text-sm text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Conditions spéciales:</strong> {tender.conditions}
                </span>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 border-t">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Publié le {publicationDate}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setViewTender(tender)
                      setDetailsDialogOpen(true)
                    }}
                  >
                    Voir les détails
                  </Button>
                  <Button onClick={() => handleSubmitOffer(tender)}>Soumettre une offre</Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {mounted && selectedTender && (
        <SubmitOfferDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          tenderId={selectedTender.id}
          tenderTitle={selectedTender.title}
          items={selectedTender.items}
        />
      )}

      {mounted && viewTender && (
        <TenderDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          tender={viewTender}
          onSubmitOffer={handleSubmitOffer}
        />
      )}
    </MainLayout>
  )
}
