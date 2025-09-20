"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

export default function OfferDetails() {
  const params = useParams()
  const router = useRouter()
  const [offer, setOffer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // This would be an API call in a real application
    const fetchOffer = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockOffers = [
        {
          id: "OFF-2025-001",
          tenderId: "OFR-2025-001",
          tenderTitle: "Équipement informatique",
          university: "Université de Paris",
          submittedDate: "10 avril 2025",
          deliveryDate: "10 juin 2025",
          warranty: "36 mois",
          totalAmount: "42,500.00 €",
          status: "pending",
          statusText: "En attente",
          rejectionReason: null,
          items: [
            {
              name: "Ordinateurs portables",
              quantity: 20,
              brand: "Dell",
              pricePerUnit: "1,500.00 €",
              total: "30,000.00 €",
            },
            { name: "Imprimantes laser", quantity: 5, brand: "HP", pricePerUnit: "850.00 €", total: "4,250.00 €" },
            { name: 'Écrans 27"', quantity: 15, brand: "Samsung", pricePerUnit: "550.00 €", total: "8,250.00 €" },
          ],
          contact: "Jean Dupont",
          contactEmail: "j.dupont@techsupply.fr",
          contactPhone: "+33 1 23 45 67 89",
        },
        {
          id: "OFF-2025-002",
          tenderId: "OFR-2024-045",
          tenderTitle: "Matériel de laboratoire",
          university: "Université de Lyon",
          submittedDate: "5 avril 2025",
          deliveryDate: "5 juin 2025",
          warranty: "24 mois",
          totalAmount: "18,750.00 €",
          status: "accepted",
          statusText: "Acceptée",
          rejectionReason: null,
          acceptedDate: "12 avril 2025",
          acceptedBy: "Dr. Marie Laurent",
          items: [
            { name: "Paillasses", quantity: 10, brand: "LabTech", pricePerUnit: "1,200.00 €", total: "12,000.00 €" },
            {
              name: "Tabourets de laboratoire",
              quantity: 30,
              brand: "LabTech",
              pricePerUnit: "125.00 €",
              total: "3,750.00 €",
            },
            {
              name: "Armoires de sécurité",
              quantity: 5,
              brand: "SafetyFirst",
              pricePerUnit: "600.00 €",
              total: "3,000.00 €",
            },
          ],
          contact: "Jean Dupont",
          contactEmail: "j.dupont@techsupply.fr",
          contactPhone: "+33 1 23 45 67 89",
        },
        {
          id: "OFF-2025-003",
          tenderId: "OFR-2024-039",
          tenderTitle: "Mobilier de bureau",
          university: "Université de Bordeaux",
          submittedDate: "1 avril 2025",
          deliveryDate: "1 mai 2025",
          warranty: "12 mois",
          totalAmount: "15,200.00 €",
          status: "rejected",
          statusText: "Rejetée",
          rejectionReason: "Prix trop élevé par rapport aux autres offres",
          rejectedDate: "8 avril 2025",
          rejectedBy: "Comité d'achat",
          items: [
            { name: "Bureaux", quantity: 20, brand: "OfficePro", pricePerUnit: "450.00 €", total: "9,000.00 €" },
            {
              name: "Chaises de bureau",
              quantity: 20,
              brand: "OfficePro",
              pricePerUnit: "220.00 €",
              total: "4,400.00 €",
            },
            {
              name: "Armoires de rangement",
              quantity: 6,
              brand: "StoragePlus",
              pricePerUnit: "300.00 €",
              total: "1,800.00 €",
            },
          ],
          contact: "Jean Dupont",
          contactEmail: "j.dupont@techsupply.fr",
          contactPhone: "+33 1 23 45 67 89",
        },
      ]

      const foundOffer = mockOffers.find((o) => o.id === params.id)
      setOffer(foundOffer || null)
      setIsLoading(false)
    }

    fetchOffer()
  }, [params.id])

  if (isLoading) {
    return (
      <MainLayout title="Détails de l'offre" subtitle="Chargement...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    )
  }

  if (!offer) {
    return (
      <MainLayout title="Détails de l'offre" subtitle="Offre non trouvée">
        <Card>
          <CardContent className="pt-6">
            <p>L'offre demandée n'existe pas ou a été supprimée.</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/submitted-offers")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux offres soumises
            </Button>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout title={offer.tenderTitle} subtitle={`Référence: ${offer.id}`}>
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
                <CardTitle>Détails de l'offre</CardTitle>
                <StatusBadge status={offer.status}>{offer.statusText}</StatusBadge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Référence</p>
                  <p className="font-medium">{offer.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Université</p>
                  <p className="font-medium">{offer.university}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de soumission</p>
                  <p className="font-medium">{offer.submittedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Montant total</p>
                  <p className="font-medium">{offer.totalAmount}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Date de livraison prévue</p>
                  <p className="font-medium">{offer.deliveryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Période de garantie</p>
                  <p className="font-medium">{offer.warranty}</p>
                </div>
              </div>

              {offer.status === "accepted" && (
                <div className="p-3 bg-green-50 rounded-md text-sm mb-4">
                  <p className="font-medium">Offre acceptée le {offer.acceptedDate}</p>
                  <p>Par: {offer.acceptedBy}</p>
                </div>
              )}

              {offer.status === "rejected" && (
                <div className="p-3 bg-red-50 rounded-md text-sm mb-4">
                  <p className="font-medium">Offre rejetée le {offer.rejectedDate}</p>
                  <p>Par: {offer.rejectedBy}</p>
                  <p className="mt-2">
                    <strong>Motif de rejet:</strong> {offer.rejectionReason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Détails des équipements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Équipement</th>
                      <th className="px-4 py-2 text-left font-medium">Quantité</th>
                      <th className="px-4 py-2 text-left font-medium">Marque</th>
                      <th className="px-4 py-2 text-left font-medium">Prix unitaire</th>
                      <th className="px-4 py-2 text-left font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offer.items.map((item: any, index: number) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">{item.brand}</td>
                        <td className="px-4 py-2">{item.pricePerUnit}</td>
                        <td className="px-4 py-2">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/50">
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-right font-medium">
                        Total
                      </td>
                      <td className="px-4 py-2 font-medium">{offer.totalAmount}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
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
                <p className="font-medium">{offer.contact}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{offer.contactEmail}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-medium">{offer.contactPhone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                Télécharger le PDF
              </Button>
              {offer.status === "pending" && (
                <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                  Annuler l'offre
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

function StatusBadge({ status, children }: { status: string; children: React.ReactNode }) {
  const statusClasses = {
    pending: "status-pending",
    accepted: "status-accepted",
    rejected: "status-rejected",
  }

  return <Badge className={`status-badge ${statusClasses[status as keyof typeof statusClasses]}`}>{children}</Badge>
}
