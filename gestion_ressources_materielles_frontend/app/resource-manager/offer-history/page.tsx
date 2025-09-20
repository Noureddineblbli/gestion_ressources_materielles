"use client"

import { useState, useEffect } from "react"
import { ResourceManagerLayout } from "@/components/layout/resource-manager-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, Download, FileText, Users, CheckCircle2, Filter, Inbox } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function OfferHistory() {
  const [offerHistory, setOfferHistory] = useState([])
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [activeYear, setActiveYear] = useState("all")

  // Load offer history from localStorage
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("offerHistory")
      if (storedHistory) {
        const history = JSON.parse(storedHistory)
        setOfferHistory(history)

        // Set default active year to the most recent year if there's history
        if (history.length > 0) {
          const years = [...new Set(history.map((offer) => new Date(offer.createdAt).getFullYear()))]
          if (years.length > 0) {
            setActiveYear(years[0].toString())
          }
        }
      }
    } catch (error) {
      console.error("Error loading offer history:", error)
    }
  }, [])

  // Get unique years from offer history
  const years = [...new Set(offerHistory.map((offer) => new Date(offer.createdAt).getFullYear()))].sort((a, b) => b - a) // Sort years in descending order

  // Filter offers by selected year
  const filteredOffers =
    activeYear === "all"
      ? offerHistory
      : offerHistory.filter((offer) => new Date(offer.createdAt).getFullYear() === Number.parseInt(activeYear))

  // Group offers by month
  const offersByMonth = filteredOffers.reduce((acc, offer) => {
    const date = new Date(offer.createdAt)
    const month = date.getMonth()
    const year = date.getFullYear()
    const key = `${year}-${month}`

    if (!acc[key]) {
      acc[key] = {
        month,
        year,
        offers: [],
      }
    }

    acc[key].offers.push(offer)
    return acc
  }, {})

  // Sort months in descending order
  const sortedMonths = Object.values(offersByMonth).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return b.month - a.month
  })

  const openOfferDetails = (offer) => {
    setSelectedOffer(offer)
    setIsDetailsOpen(true)
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: fr })
    } catch (error) {
      return dateString
    }
  }

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy à HH:mm", { locale: fr })
    } catch (error) {
      return dateString
    }
  }

  return (
    <ResourceManagerLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gérer les offres des fournisseurs et sélectionner le meilleur candidat
          </h1>
          <p className="text-muted-foreground">Comparez les offres et sélectionnez le fournisseur le plus adapté.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Offres des fournisseurs</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </div>

        {offerHistory.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-10 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <Inbox className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Aucune offre disponible</h3>
            <p className="mb-4 text-muted-foreground">Il n'y a pas encore d'offres de fournisseurs à afficher.</p>
          </Card>
        ) : (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Historique des offres fournisseurs</h2>

              <Tabs value={activeYear} onValueChange={setActiveYear} className="w-auto">
                <TabsList>
                  {years.map((year) => (
                    <TabsTrigger key={year} value={year.toString()}>
                      {year}
                    </TabsTrigger>
                  ))}
                  {years.length > 1 && <TabsTrigger value="all">Toutes les années</TabsTrigger>}
                </TabsList>
              </Tabs>
            </div>

            {sortedMonths.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 opacity-30 mb-2" />
                    <p>Aucune offre fournisseur n'a été créée pour le moment.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              sortedMonths.map(({ month, year, offers }) => (
                <div key={`${year}-${month}`} className="mb-8">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                    {format(new Date(year, month), "MMMM yyyy", { locale: fr })}
                  </h3>

                  <div className="grid gap-4">
                    {offers.map((offer) => (
                      <Card key={offer.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{offer.title}</CardTitle>
                              <CardDescription className="mt-1">
                                Créée le {formatDateTime(offer.createdAt)}
                              </CardDescription>
                            </div>
                            <Badge>Date limite: {format(new Date(offer.deadline), "dd/MM/yyyy")}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Description:</p>
                              <p className="text-sm">{offer.description}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Départements inclus:</p>
                              <p className="text-sm">{offer.departments.length} départements</p>
                            </div>
                          </div>

                          {offer.selectedSupplier && (
                            <div className="mb-4 border border-green-200 rounded-md bg-green-50 p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <p className="text-sm font-medium text-green-700">Fournisseur sélectionné</p>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <p className="text-green-700">Fournisseur:</p>
                                  <p className="font-medium">{offer.selectedSupplier.name}</p>
                                </div>
                                <div>
                                  <p className="text-green-700">Coût total:</p>
                                  <p className="font-medium">{offer.selectedSupplier.totalCost.toLocaleString()} €</p>
                                </div>
                                <div>
                                  <p className="text-green-700">Date de livraison:</p>
                                  <p className="font-medium">{offer.selectedSupplier.deliveryDate}</p>
                                </div>
                                <div>
                                  <p className="text-green-700">Sélectionné le:</p>
                                  <p className="font-medium">{formatDate(offer.selectedSupplier.selectionDate)}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => openOfferDetails(offer)}>
                              Voir détails
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Offer Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedOffer?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="h-4 w-4" />
                <span>Créée le {selectedOffer && formatDateTime(selectedOffer.createdAt)}</span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-base font-semibold mb-2">Détails de l'offre</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Description:</p>
                    <p className="font-medium">{selectedOffer?.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date limite:</p>
                    <p className="font-medium">
                      {selectedOffer && format(new Date(selectedOffer.deadline), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold mb-2">Notes</h3>
                <p className="text-sm border rounded-md p-3 bg-muted/50 min-h-[80px]">
                  {selectedOffer?.notes || "Aucune note fournie."}
                </p>
              </div>
            </div>

            {selectedOffer?.selectedSupplier && (
              <div>
                <h3 className="text-base font-semibold mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  Fournisseur sélectionné
                </h3>
                <div className="border border-green-200 rounded-md bg-green-50 p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-green-700">Fournisseur:</p>
                      <p className="font-medium">{selectedOffer?.selectedSupplier.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Email:</p>
                      <p className="font-medium">{selectedOffer?.selectedSupplier.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Date de livraison:</p>
                      <p className="font-medium">{selectedOffer?.selectedSupplier.deliveryDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Garantie:</p>
                      <p className="font-medium">{selectedOffer?.selectedSupplier.warrantyPeriod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Coût total:</p>
                      <p className="font-medium">{selectedOffer?.selectedSupplier.totalCost.toLocaleString()} €</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Nombre d'articles:</p>
                      <p className="font-medium">{selectedOffer?.selectedSupplier.itemCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Sélectionné le:</p>
                      <p className="font-medium">
                        {selectedOffer && formatDate(selectedOffer.selectedSupplier.selectionDate)}
                      </p>
                    </div>
                  </div>

                  <Tabs defaultValue="items">
                    <TabsList>
                      <TabsTrigger value="items">Articles</TabsTrigger>
                      <TabsTrigger value="departments">Départements</TabsTrigger>
                    </TabsList>
                    <TabsContent value="items" className="mt-4">
                      <ScrollArea className="h-64 rounded-md border">
                        <div className="p-4">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="pb-2 text-left font-medium">Type</th>
                                <th className="pb-2 text-left font-medium">Marque</th>
                                <th className="pb-2 text-left font-medium">Spécifications</th>
                                <th className="pb-2 text-right font-medium">Prix unitaire</th>
                                <th className="pb-2 text-right font-medium">Quantité</th>
                                <th className="pb-2 text-right font-medium">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedOffer?.selectedSupplier.items.map((item, index) => (
                                <tr key={index} className="border-b last:border-0">
                                  <td className="py-3">{item.type}</td>
                                  <td className="py-3">{item.brand}</td>
                                  <td className="py-3">{item.specs}</td>
                                  <td className="py-3 text-right">{item.unitPrice} €</td>
                                  <td className="py-3 text-right">{item.quantity}</td>
                                  <td className="py-3 text-right">{item.total} €</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="departments" className="mt-4">
                      <ScrollArea className="h-64 rounded-md border">
                        <div className="p-4">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="pb-2 text-left font-medium">Département</th>
                                <th className="pb-2 text-left font-medium">Chef de département</th>
                                <th className="pb-2 text-left font-medium">Nombre d'articles</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedOffer?.departments.map((dept, index) => (
                                <tr key={index} className="border-b last:border-0">
                                  <td className="py-3">{dept.name}</td>
                                  <td className="py-3">{dept.head}</td>
                                  <td className="py-3">{dept.itemCount}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-base font-semibold mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Départements inclus ({selectedOffer?.departments.length})
              </h3>

              <ScrollArea className="h-64 rounded-md border">
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-2 text-left font-medium">Département</th>
                        <th className="pb-2 text-left font-medium">Chef de département</th>
                        <th className="pb-2 text-left font-medium">Nombre d'articles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOffer?.departments.map((dept, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-3">{dept.name}</td>
                          <td className="py-3">{dept.head}</td>
                          <td className="py-3">{dept.itemCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter PDF
              </Button>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ResourceManagerLayout>
  )
}
