"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, FileText, Info, ArrowLeft, Building, MapPin } from "lucide-react"
import { SubmitOfferDialog } from "@/components/submit-offer-dialog"
import { useAuth } from "@/lib/auth"

export default function TenderDetails() {
  const params = useParams()
  const router = useRouter()
  const { checkProfileComplete } = useAuth()
  const [tender, setTender] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // This would be an API call in a real application
    const fetchTender = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockTenders = [
        {
          id: "OFR-2025-001",
          title: "Équipement informatique",
          description:
            "Fourniture d'ordinateurs portables, imprimantes et accessoires pour le département d'informatique.",
          items: [
            { name: "Ordinateurs portables", quantity: 20, specs: "i7, 16GB RAM, 512GB SSD" },
            { name: "Imprimantes laser", quantity: 5, specs: "Couleur, recto-verso" },
            { name: 'Écrans 27"', quantity: 15, specs: "4K, IPS" },
          ],
          deadline: "15 mai 2025",
          publishedDate: "1 avril 2025",
          conditions: "Livraison sous 30 jours, garantie 3 ans minimum",
          university: "Université de Paris",
          location: "Paris, France",
          contact: "service.achats@univ-paris.fr",
          budget: "50,000 € - 70,000 €",
          documents: [
            { name: "Cahier des charges.pdf", size: "2.4 MB" },
            { name: "Spécifications techniques.pdf", size: "1.8 MB" },
          ],
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
          publishedDate: "5 avril 2025",
          conditions: "Installation incluse, conformité aux normes de sécurité",
          university: "Université de Lyon",
          location: "Lyon, France",
          contact: "achats@univ-lyon.fr",
          budget: "30,000 € - 45,000 €",
          documents: [
            { name: "Cahier des charges.pdf", size: "3.1 MB" },
            { name: "Plan des laboratoires.pdf", size: "5.2 MB" },
          ],
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
          publishedDate: "10 avril 2025",
          conditions: "Installation et formation incluses",
          university: "Université de Bordeaux",
          location: "Bordeaux, France",
          contact: "service-achats@u-bordeaux.fr",
          budget: "40,000 € - 60,000 €",
          documents: [
            { name: "Cahier des charges.pdf", size: "2.8 MB" },
            { name: "Spécifications techniques.pdf", size: "1.5 MB" },
          ],
        },
      ]

      const foundTender = mockTenders.find((t) => t.id === params.id)
      setTender(foundTender || null)
      setIsLoading(false)
    }

    fetchTender()
  }, [params.id])

  const handleSubmitOffer = () => {
    if (checkProfileComplete()) {
      setIsDialogOpen(true)
    }
  }

  if (isLoading) {
    return (
      <MainLayout title="Détails de l'offre" subtitle="Chargement...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    )
  }

  if (!tender) {
    return (
      <MainLayout title="Détails de l'offre" subtitle="Offre non trouvée">
        <Card>
          <CardContent className="pt-6">
            <p>L'offre demandée n'existe pas ou a été supprimée.</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/tenders")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux offres
            </Button>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout title={tender.title} subtitle={`Référence: ${tender.id}`}>
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{tender.description}</p>

              <div className="flex items-start gap-1 text-sm text-muted-foreground mb-4">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Conditions spéciales:</strong> {tender.conditions}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Budget estimé</h4>
                  <p className="font-medium">{tender.budget}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Date limite</h4>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {tender.deadline}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Équipements demandés</CardTitle>
            </CardHeader>
            <CardContent>
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
                    {tender.items.map((item: any, index: number) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">{item.specs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tender.documents.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{doc.size}</span>
                      <Button variant="outline" size="sm">
                        Télécharger
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Université</h4>
                <p className="font-medium flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {tender.university}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Localisation</h4>
                <p className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {tender.location}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact</h4>
                <p className="font-medium">{tender.contact}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Date de publication</h4>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {tender.publishedDate}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={handleSubmitOffer}>
                Soumettre une offre
              </Button>
              <Button variant="outline" className="w-full">
                Poser une question
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {tender && (
        <SubmitOfferDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          tenderId={tender.id}
          tenderTitle={tender.title}
          items={tender.items}
        />
      )}
    </MainLayout>
  )
}
