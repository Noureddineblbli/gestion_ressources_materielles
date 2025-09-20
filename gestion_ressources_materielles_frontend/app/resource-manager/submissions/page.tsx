"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ResourceManagerLayout } from "@/components/layout/resource-manager-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Eye, X, Check, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Mock data for supplier offers
const supplierOffers = [
  {
    id: "OFR-2025-001",
    name: "EduSources",
    email: "contact@edusources.fr",
    deliveryDate: "12 juin 2025",
    warrantyPeriod: "24 mois",
    itemCount: 49,
    totalCost: 25800,
    isLowestOffer: true,
    isBlacklisted: false,
    blacklistReason: "",
    items: [
      {
        type: "Ordinateur",
        brand: "Acer",
        specs: "Intel Core i5, 16 Go, 512 Go SSD",
        unitPrice: 1050,
        quantity: 15,
        total: 15750,
      },
      {
        type: "Projecteur",
        brand: "ViewSonic",
        specs: "4K, 3300 lumens, HDMI",
        unitPrice: 800,
        quantity: 2,
        total: 1600,
      },
      {
        type: "Imprimante",
        brand: "Epson",
        specs: "29 ppm, 1200x1200 dpi",
        unitPrice: 620,
        quantity: 2,
        total: 1240,
      },
      {
        type: "Calculatrice",
        brand: "Texas Instruments",
        specs: "Graphique, programmable",
        unitPrice: 90,
        quantity: 30,
        total: 2700,
      },
    ],
  },
  {
    id: "OFR-2025-002",
    name: "EducEquip",
    email: "ventes@educequip.fr",
    deliveryDate: "10 juin 2025",
    warrantyPeriod: "18 mois",
    itemCount: 49,
    totalCost: 26200,
    isLowestOffer: false,
    isBlacklisted: false,
    blacklistReason: "",
    items: [
      {
        type: "Ordinateur",
        brand: "HP",
        specs: "Intel Core i5, 16 Go, 512 Go SSD",
        unitPrice: 1080,
        quantity: 15,
        total: 16200,
      },
      {
        type: "Projecteur",
        brand: "Epson",
        specs: "4K, 3200 lumens, HDMI",
        unitPrice: 850,
        quantity: 2,
        total: 1700,
      },
      {
        type: "Imprimante",
        brand: "HP",
        specs: "27 ppm, 1200x1200 dpi",
        unitPrice: 650,
        quantity: 2,
        total: 1300,
      },
      {
        type: "Calculatrice",
        brand: "Casio",
        specs: "Graphique, programmable",
        unitPrice: 95,
        quantity: 30,
        total: 2850,
      },
    ],
  },
  {
    id: "OFR-2025-003",
    name: "TechPro Solutions",
    email: "contact@techpro.fr",
    deliveryDate: "15 juin 2025",
    warrantyPeriod: "36 mois",
    itemCount: 49,
    totalCost: 27500,
    isLowestOffer: false,
    isBlacklisted: false,
    blacklistReason: "",
    items: [
      {
        type: "Ordinateur",
        brand: "Dell",
        specs: "Intel Core i7, 16 Go, 512 Go SSD",
        unitPrice: 1150,
        quantity: 15,
        total: 17250,
      },
      {
        type: "Projecteur",
        brand: "BenQ",
        specs: "4K, 3500 lumens, HDMI",
        unitPrice: 900,
        quantity: 2,
        total: 1800,
      },
      {
        type: "Imprimante",
        brand: "Brother",
        specs: "30 ppm, 1200x1200 dpi",
        unitPrice: 680,
        quantity: 2,
        total: 1360,
      },
      {
        type: "Calculatrice",
        brand: "HP",
        specs: "Graphique, programmable",
        unitPrice: 93,
        quantity: 30,
        total: 2790,
      },
    ],
  },
  {
    id: "OFR-2025-004",
    name: "AcademiTech",
    email: "info@academitech.fr",
    deliveryDate: "20 juin 2025",
    warrantyPeriod: "36 mois",
    itemCount: 49,
    totalCost: 31500,
    isLowestOffer: false,
    isBlacklisted: true,
    blacklistReason: "Retards de livraison répétés sur les commandes précédentes",
    items: [
      {
        type: "Ordinateur",
        brand: "Lenovo",
        specs: "Intel Core i7, 32 Go, 1 To SSD",
        unitPrice: 1350,
        quantity: 15,
        total: 20250,
      },
      {
        type: "Projecteur",
        brand: "Sony",
        specs: "4K, 3800 lumens, HDMI",
        unitPrice: 1200,
        quantity: 2,
        total: 2400,
      },
      {
        type: "Imprimante",
        brand: "Canon",
        specs: "35 ppm, 1200x1200 dpi",
        unitPrice: 750,
        quantity: 2,
        total: 1500,
      },
      {
        type: "Calculatrice",
        brand: "Sharp",
        specs: "Graphique, programmable",
        unitPrice: 105,
        quantity: 30,
        total: 3150,
      },
    ],
  },
]

export default function Submissions() {
  const router = useRouter()
  const [offers, setOffers] = useState(supplierOffers)
  const [selectedOffer, setSelectedOffer] = useState<(typeof supplierOffers)[0] | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [blacklistDialogOpen, setBlacklistDialogOpen] = useState(false)
  const [selectDialogOpen, setSelectDialogOpen] = useState(false)
  const [blacklistReason, setBlacklistReason] = useState("")
  const [supplierToBlacklist, setSupplierToBlacklist] = useState<(typeof supplierOffers)[0] | null>(null)
  const [supplierToSelect, setSupplierToSelect] = useState<(typeof supplierOffers)[0] | null>(null)
  const [selectionComplete, setSelectionComplete] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<(typeof supplierOffers)[0] | null>(null)

  const handleViewDetails = (offer: (typeof supplierOffers)[0]) => {
    setSelectedOffer(offer)
    setDetailsOpen(true)
  }

  const handleBlacklist = (offer: (typeof supplierOffers)[0]) => {
    setSupplierToBlacklist(offer)
    setBlacklistReason("")
    setBlacklistDialogOpen(true)
  }

  const handleSelect = (offer: (typeof supplierOffers)[0]) => {
    setSupplierToSelect(offer)
    setSelectDialogOpen(true)
  }

  const confirmBlacklist = () => {
    if (!supplierToBlacklist) return

    const updatedOffers = offers.map((offer) =>
      offer.id === supplierToBlacklist.id ? { ...offer, isBlacklisted: true, blacklistReason } : offer,
    )

    setOffers(updatedOffers)
    setBlacklistDialogOpen(false)
    toast({
      title: "Fournisseur blacklisté",
      description: `${supplierToBlacklist.name} a été ajouté à la liste noire.`,
      variant: "destructive",
    })
  }

  const confirmSelection = () => {
    if (!supplierToSelect) return

    // Save the selected supplier to localStorage for history
    try {
      // Get existing offer history
      const storedHistory = localStorage.getItem("offerHistory") || "[]"
      const history = JSON.parse(storedHistory)

      // Create a new history entry with the selected supplier
      const newHistoryEntry = {
        id: `OFFER-${Date.now()}`,
        title: "Offre d'approvisionnement en ressources",
        description: "Équipement informatique et matériel éducatif",
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        departments: [
          { name: "Informatique", head: "Jean Dupont", itemCount: 25 },
          { name: "Sciences", head: "Marie Martin", itemCount: 15 },
          { name: "Langues", head: "Pierre Durand", itemCount: 9 },
        ],
        notes: "Approvisionnement standard pour l'année académique",
        selectedSupplier: {
          name: supplierToSelect.name,
          email: supplierToSelect.email,
          deliveryDate: supplierToSelect.deliveryDate,
          warrantyPeriod: supplierToSelect.warrantyPeriod,
          totalCost: supplierToSelect.totalCost,
          itemCount: supplierToSelect.itemCount,
          selectionDate: new Date().toISOString(),
          items: supplierToSelect.items,
        },
      }

      // Add to history
      history.unshift(newHistoryEntry)

      // Save updated history
      localStorage.setItem("offerHistory", JSON.stringify(history))
    } catch (error) {
      console.error("Error saving to offer history:", error)
    }

    // Set selection complete state
    setSelectedSupplier(supplierToSelect)
    setSelectionComplete(true)
    setSelectDialogOpen(false)

    toast({
      title: "Fournisseur sélectionné",
      description: `${supplierToSelect.name} a été sélectionné comme fournisseur pour cette offre.`,
      variant: "default",
    })
  }

  const startNewSelection = () => {
    // Reset the state to start a new selection process
    setSelectionComplete(false)
    setSelectedSupplier(null)

    toast({
      title: "Nouvelle sélection",
      description: "Vous pouvez maintenant commencer une nouvelle sélection de fournisseur.",
    })
  }

  const navigateToHistory = () => {
    router.push("/resource-manager/offer-history")
  }

  return (
    <ResourceManagerLayout
      title="Gérer les offres des fournisseurs et sélectionner le meilleur candidat"
      subtitle="Comparez les offres et sélectionnez le fournisseur le plus adapté"
    >
      <div className="space-y-6">
        {selectionComplete ? (
          // Empty space after selection is complete
          <div></div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Offres des fournisseurs</h2>
              {offers.some((offer) => offer.isLowestOffer && !offer.isBlacklisted) && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 text-sm">
                  Offre la plus basse: {offers.find((o) => o.isLowestOffer && !o.isBlacklisted)?.name} -{" "}
                  {offers.find((o) => o.isLowestOffer && !o.isBlacklisted)?.totalCost.toLocaleString()} €
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              {offers.map((offer, index) => (
                <Card
                  key={index}
                  className={`border ${offer.isBlacklisted ? "bg-red-50 border-red-200" : "border-gray-200"}`}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{offer.name}</h3>
                          <p className="text-sm text-gray-500">{offer.email}</p>
                        </div>
                        {offer.isBlacklisted && (
                          <Badge variant="destructive" className="ml-auto">
                            Blacklisté
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-4 py-2">
                        <div>
                          <p className="text-sm text-gray-500">Date de livraison</p>
                          <p className="font-medium text-amber-700">{offer.deliveryDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Période de garantie</p>
                          <p className="font-medium">{offer.warrantyPeriod}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Nombre d'articles</p>
                          <p className="font-medium">{offer.itemCount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Coût total</p>
                          <p className="font-medium text-lg">{offer.totalCost.toLocaleString()} €</p>
                        </div>
                      </div>

                      {offer.isBlacklisted && (
                        <div className="border border-red-200 rounded-md bg-red-50 p-3 flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-red-500">Raison du blacklist</p>
                            <p className="text-sm text-red-700">{offer.blacklistReason}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => handleViewDetails(offer)}>
                          <Eye className="h-4 w-4" />
                          Voir détails
                        </Button>

                        {!offer.isBlacklisted && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleBlacklist(offer)}
                            >
                              <X className="h-4 w-4" />
                              Blacklister
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="gap-1 bg-gray-900"
                              onClick={() => handleSelect(offer)}
                            >
                              <Check className="h-4 w-4" />
                              Sélectionner
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <OfferDetailsDialog offer={selectedOffer} open={detailsOpen} onOpenChange={setDetailsOpen} />

        <Dialog open={blacklistDialogOpen} onOpenChange={setBlacklistDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Blacklister le fournisseur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-500">
                Veuillez fournir une raison pour blacklister {supplierToBlacklist?.name}. Cette raison sera incluse dans
                la notification envoyée au fournisseur.
              </p>
              <div className="space-y-2">
                <p className="font-medium text-sm">Raison du blacklist</p>
                <Textarea
                  placeholder="Expliquez pourquoi ce fournisseur est blacklisté..."
                  value={blacklistReason}
                  onChange={(e) => setBlacklistReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setBlacklistDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="button" variant="destructive" onClick={confirmBlacklist} disabled={!blacklistReason.trim()}>
                Confirmer le blacklist
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={selectDialogOpen} onOpenChange={setSelectDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Sélectionner le fournisseur</DialogTitle>
              <DialogDescription>
                Vous êtes sur le point de sélectionner {supplierToSelect?.name} comme fournisseur pour cette offre.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-amber-800 mb-2">Détails de l'offre</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-amber-700">Fournisseur:</p>
                    <p className="font-medium">{supplierToSelect?.name}</p>
                  </div>
                  <div>
                    <p className="text-amber-700">Coût total:</p>
                    <p className="font-medium">{supplierToSelect?.totalCost.toLocaleString()} €</p>
                  </div>
                  <div>
                    <p className="text-amber-700">Date de livraison:</p>
                    <p className="font-medium">{supplierToSelect?.deliveryDate}</p>
                  </div>
                  <div>
                    <p className="text-amber-700">Garantie:</p>
                    <p className="font-medium">{supplierToSelect?.warrantyPeriod}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Cette action est définitive. Une fois confirmée, le fournisseur sera notifié et les détails de cette
                sélection seront enregistrés dans l'historique des offres.
              </p>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setSelectDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="button" onClick={confirmSelection}>
                Confirmer la sélection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ResourceManagerLayout>
  )
}

interface OfferDetailsDialogProps {
  offer: (typeof supplierOffers)[0] | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function OfferDetailsDialog({ offer, open, onOpenChange }: OfferDetailsDialogProps) {
  if (!offer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de l'offre - {offer.name}</DialogTitle>
          <p className="text-sm text-gray-500">Détails complets de l'offre du fournisseur</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1 border rounded-md p-4">
              <p className="text-sm text-gray-500">Date de livraison</p>
              <p className="font-medium">{offer.deliveryDate}</p>
            </div>
            <div className="space-y-1 border rounded-md p-4">
              <p className="text-sm text-gray-500">Période de garantie</p>
              <p className="font-medium">{offer.warrantyPeriod}</p>
            </div>
            <div className="space-y-1 border rounded-md p-4">
              <p className="text-sm text-gray-500">Coût total</p>
              <p className="font-medium">{offer.totalCost.toLocaleString()} €</p>
            </div>
          </div>

          {offer.isBlacklisted && (
            <div className="border border-red-200 rounded-md bg-red-50 p-4 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-500">Raison du blacklist</p>
                <p className="text-sm text-red-700">{offer.blacklistReason}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-medium">Articles proposés</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Type</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Marque</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Spécifications</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Prix unitaire</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Quantité</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {offer.items.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3">{item.type}</td>
                      <td className="px-4 py-3">{item.brand}</td>
                      <td className="px-4 py-3">{item.specs}</td>
                      <td className="px-4 py-3">{item.unitPrice} €</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">{item.total} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
