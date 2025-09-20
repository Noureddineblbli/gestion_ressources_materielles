"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye } from "lucide-react"
// Remove this line:
// import Link from "next/link"

const offers = [
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
    equipment: [
      {
        name: "Ordinateurs portables",
        quantity: 20,
        unitPrice: "1,500.00 €",
        totalPrice: "30,000.00 €",
        specs: "i7, 16GB RAM, 512GB SSD",
      },
      {
        name: "Imprimantes laser",
        quantity: 5,
        unitPrice: "800.00 €",
        totalPrice: "4,000.00 €",
        specs: "Couleur, recto-verso",
      },
      { name: 'Écrans 27"', quantity: 15, unitPrice: "500.00 €", totalPrice: "7,500.00 €", specs: "4K, IPS" },
      {
        name: "Accessoires divers",
        quantity: 1,
        unitPrice: "1,000.00 €",
        totalPrice: "1,000.00 €",
        specs: "Claviers, souris, câbles",
      },
    ],
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
    equipment: [
      {
        name: "Burettes graduées",
        quantity: 100,
        unitPrice: "25.00 €",
        totalPrice: "2,500.00 €",
        specs: "Verre borosilicate, 50ml",
      },
      {
        name: "Microscopes optiques",
        quantity: 10,
        unitPrice: "1,200.00 €",
        totalPrice: "12,000.00 €",
        specs: "Objectifs achromatiques, éclairage LED",
      },
      {
        name: "Agitateurs magnétiques",
        quantity: 15,
        unitPrice: "150.00 €",
        totalPrice: "2,250.00 €",
        specs: "Plaque chauffante, contrôle de vitesse",
      },
      {
        name: "Pipettes automatiques",
        quantity: 50,
        unitPrice: "40.00 €",
        totalPrice: "2,000.00 €",
        specs: "Volume variable, stérilisables",
      },
    ],
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
    equipment: [
      {
        name: "Bureaux individuels",
        quantity: 30,
        unitPrice: "300.00 €",
        totalPrice: "9,000.00 €",
        specs: "Plateau mélaminé, pieds réglables",
      },
      {
        name: "Chaises de bureau",
        quantity: 30,
        unitPrice: "150.00 €",
        totalPrice: "4,500.00 €",
        specs: "Ergonomiques, réglables en hauteur",
      },
      {
        name: "Armoires de rangement",
        quantity: 5,
        unitPrice: "300.00 €",
        totalPrice: "1,500.00 €",
        specs: "Portes coulissantes, étagères réglables",
      },
      {
        name: "Lampes de bureau",
        quantity: 30,
        unitPrice: "10.00 €",
        totalPrice: "300.00 €",
        specs: "LED, orientables",
      },
    ],
  },
  {
    id: "OFF-2025-004",
    tenderId: "OFR-2024-038",
    tenderTitle: "Équipement audiovisuel",
    university: "Université de Marseille",
    submittedDate: "28 mars 2025",
    deliveryDate: "28 mai 2025",
    warranty: "24 mois",
    totalAmount: "32,800.00 €",
    status: "accepted",
    statusText: "Acceptée",
    rejectionReason: null,
    equipment: [
      {
        name: "Projecteurs Full HD",
        quantity: 3,
        unitPrice: "3,000.00 €",
        totalPrice: "9,000.00 €",
        specs: "3000 lumens, HDMI",
      },
      {
        name: "Écrans de projection",
        quantity: 3,
        unitPrice: "800.00 €",
        totalPrice: "2,400.00 €",
        specs: "120 pouces, motorisés",
      },
      {
        name: "Systèmes de sonorisation",
        quantity: 3,
        unitPrice: "5,000.00 €",
        totalPrice: "15,000.00 €",
        specs: "Amplificateur, enceintes, microphones",
      },
      {
        name: "Caméras HD",
        quantity: 2,
        unitPrice: "1,700.00 €",
        totalPrice: "3,400.00 €",
        specs: "Capteur CMOS, zoom optique",
      },
      { name: "Micros sans fil", quantity: 1, unitPrice: "300.00 €", totalPrice: "300.00 €", specs: "Divers" },
      {
        name: "Cables et connectiques",
        quantity: 1,
        unitPrice: "2700.00 €",
        totalPrice: "2,700.00 €",
        specs: "Divers",
      },
    ],
  },
  {
    id: "OFF-2025-005",
    tenderId: "OFR-2024-037",
    tenderTitle: "Serveurs informatiques",
    university: "Université de Lille",
    submittedDate: "25 mars 2025",
    deliveryDate: "25 avril 2025",
    warranty: "48 mois",
    totalAmount: "65,000.00 €",
    status: "pending",
    statusText: "En attente",
    rejectionReason: null,
    equipment: [
      {
        name: "Serveurs rackables",
        quantity: 2,
        unitPrice: "25,000.00 €",
        totalPrice: "50,000.00 €",
        specs: "Processeur Xeon, 64GB RAM, 2TB SSD",
      },
      {
        name: "Onduleurs",
        quantity: 2,
        unitPrice: "2,000.00 €",
        totalPrice: "4,000.00 €",
        specs: "3000VA, autonomie 30 minutes",
      },
      {
        name: "Switchs réseau",
        quantity: 2,
        unitPrice: "3,000.00 €",
        totalPrice: "6,000.00 €",
        specs: "24 ports Gigabit, PoE",
      },
      {
        name: "Logiciels de virtualisation",
        quantity: 1,
        unitPrice: "5,000.00 €",
        totalPrice: "5,000.00 €",
        specs: "Licence perpétuelle",
      },
    ],
  },
]

export default function SubmittedOffers() {
  return (
    <MainLayout title="Offres soumises" subtitle="Suivez l'état de vos offres">
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="accepted">Acceptées</TabsTrigger>
          <TabsTrigger value="rejected">Rejetées</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          <OffersList offers={offers.filter((offer) => offer.status === "pending")} />
        </TabsContent>

        <TabsContent value="accepted" className="mt-0">
          <OffersList offers={offers.filter((offer) => offer.status === "accepted")} />
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          <OffersList offers={offers.filter((offer) => offer.status === "rejected")} />
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}

function OffersList({ offers }: { offers: typeof offers }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<(typeof offers)[0] | null>(null)

  if (offers.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Aucune offre trouvée</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {offers.map((offer) => (
        <Card key={offer.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{offer.tenderTitle}</CardTitle>
              <StatusBadge status={offer.status}>{offer.statusText}</StatusBadge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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

            {offer.status === "rejected" && (
              <div className="mt-2 p-3 bg-destructive/10 rounded-md text-sm">
                <p className="font-medium">Motif de rejet:</p>
                <p>{offer.rejectionReason}</p>
              </div>
            )}

            <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => {
                  setSelectedOffer(offer)
                  setIsDetailsOpen(true)
                }}
              >
                <Eye className="h-4 w-4" />
                Voir les détails
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {selectedOffer && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedOffer.tenderTitle}</DialogTitle>
              <DialogDescription>Référence: {selectedOffer.id}</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
              <div>
                <p className="text-sm text-muted-foreground">Université</p>
                <p className="font-medium">{selectedOffer.university}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de soumission</p>
                <p className="font-medium">{selectedOffer.submittedDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de livraison</p>
                <p className="font-medium">{selectedOffer.deliveryDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Garantie</p>
                <p className="font-medium">{selectedOffer.warranty}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Montant total</p>
              <p className="font-medium text-lg">{selectedOffer.totalAmount}</p>
            </div>

            {selectedOffer.status === "rejected" && (
              <div className="mt-2 p-3 bg-destructive/10 rounded-md text-sm">
                <p className="font-medium">Motif de rejet:</p>
                <p>{selectedOffer.rejectionReason}</p>
              </div>
            )}

            <div className="my-6">
              <h3 className="font-medium text-lg mb-2">Détails des équipements</h3>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-2">Équipement</th>
                      <th className="text-center p-2">Quantité</th>
                      <th className="text-center p-2">Prix unitaire</th>
                      <th className="text-right p-2">Prix total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOffer.equipment?.map((item, index) => (
                      <tr key={index} className={index !== selectedOffer.equipment.length - 1 ? "border-b" : ""}>
                        <td className="p-2">
                          <div>{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.specs}</div>
                        </td>
                        <td className="text-center p-2">{item.quantity}</td>
                        <td className="text-center p-2">{item.unitPrice}</td>
                        <td className="text-right p-2">{item.totalPrice}</td>
                      </tr>
                    ))}
                    <tr className="border-t bg-muted/50">
                      <td colSpan={3} className="text-right p-2 font-medium">
                        Total
                      </td>
                      <td className="text-right p-2 font-medium">{selectedOffer.totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
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
