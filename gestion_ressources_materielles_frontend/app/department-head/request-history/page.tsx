"use client"

import { useState } from "react"
import { DepartmentHeadLayout } from "@/components/layout/department-head-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Laptop, Printer, Search, FileDown, Calendar, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Get history from localStorage if available
const getHistoryFromStorage = () => {
  if (typeof window !== "undefined") {
    const storedHistory = localStorage.getItem("requestHistory")
    if (storedHistory) {
      return JSON.parse(storedHistory)
    }
  }
  return []
}

export default function RequestHistory() {
  // Initial history data - in a real app, this would come from a database
  const [history, setHistory] = useState(getHistoryFromStorage())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterYear, setFilterYear] = useState("all")
  const [filterMonth, setFilterMonth] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  // Get unique years from history
  const years = [...new Set(history.map((item) => new Date(item.dateSent).getFullYear()))].sort((a, b) => b - a)

  // Get months for select
  const months = [
    { value: "0", label: "Janvier" },
    { value: "1", label: "Février" },
    { value: "2", label: "Mars" },
    { value: "3", label: "Avril" },
    { value: "4", label: "Mai" },
    { value: "5", label: "Juin" },
    { value: "6", label: "Juillet" },
    { value: "7", label: "Août" },
    { value: "8", label: "Septembre" },
    { value: "9", label: "Octobre" },
    { value: "10", label: "Novembre" },
    { value: "11", label: "Décembre" },
  ]

  const handleViewDetails = (request) => {
    setSelectedRequest(request)
    setIsDetailsDialogOpen(true)
  }

  // Filter and search history
  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.requests.some(
        (req) =>
          req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.specifications.toLowerCase().includes(searchTerm.toLowerCase()),
      )

    const itemDate = new Date(item.dateSent)
    const matchesYear = filterYear === "all" || itemDate.getFullYear().toString() === filterYear
    const matchesMonth = filterMonth === "all" || itemDate.getMonth().toString() === filterMonth

    const matchesType =
      filterType === "all" ||
      item.requests.some(
        (req) =>
          (filterType === "computer" && req.type === "Ordinateur") ||
          (filterType === "printer" && req.type === "Imprimante"),
      )

    return matchesSearch && matchesYear && matchesMonth && matchesType
  })

  // Group history by year and month
  const groupedHistory = filteredHistory.reduce((acc, item) => {
    const date = new Date(item.dateSent)
    const year = date.getFullYear()
    const month = date.getMonth()

    if (!acc[year]) {
      acc[year] = {}
    }

    if (!acc[year][month]) {
      acc[year][month] = []
    }

    acc[year][month].push(item)
    return acc
  }, {})

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Reset filters
  const resetFilters = () => {
    setFilterYear("all")
    setFilterMonth("all")
    setFilterType("all")
    setIsFilterDialogOpen(false)
  }

  return (
    <DepartmentHeadLayout
      title="Historique des Demandes"
      subtitle="Consultez l'historique des demandes envoyées au gestionnaire de ressources"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par ID, enseignant, type..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filtrer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filtrer l'historique</DialogTitle>
                <DialogDescription>Filtrez l'historique des demandes par année, mois et type</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="year">Année</Label>
                  <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Toutes les années" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les années</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="month">Mois</Label>
                  <Select value={filterMonth} onValueChange={setFilterMonth}>
                    <SelectTrigger id="month">
                      <SelectValue placeholder="Tous les mois" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les mois</SelectItem>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="type">Type de ressource</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="computer">Ordinateurs</SelectItem>
                      <SelectItem value="printer">Imprimantes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetFilters}>
                  Réinitialiser
                </Button>
                <Button onClick={() => setIsFilterDialogOpen(false)}>Appliquer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="flex items-center gap-1">
            <FileDown className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun historique trouvé</h3>
            <p className="text-gray-500 text-center max-w-md">
              {history.length === 0
                ? "Vous n'avez pas encore envoyé de demandes au gestionnaire de ressources."
                : "Aucune demande ne correspond à vos critères de recherche ou de filtrage."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedHistory)
            .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
            .map(([year, months]) => (
              <div key={year}>
                <h2 className="text-xl font-semibold mb-4">{year}</h2>

                <div className="space-y-6">
                  {Object.entries(months)
                    .sort(([monthA], [monthB]) => Number(monthB) - Number(monthA))
                    .map(([month, items]) => (
                      <div key={`${year}-${month}`}>
                        <h3 className="text-md font-medium text-gray-600 mb-3">{months[Number(month)].label}</h3>

                        <div className="space-y-3">
                          {items.map((item) => (
                            <Card key={item.batchId} className="overflow-hidden hover:shadow-md transition-shadow">
                              <div className="flex flex-col sm:flex-row">
                                <div className="p-4 sm:p-6 flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="text-lg font-medium mb-1">Envoi #{item.batchId}</h4>
                                      <p className="text-sm text-gray-500 mb-2">
                                        Envoyé le {formatDate(item.dateSent)}
                                      </p>
                                    </div>
                                    <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                                      {item.requests.length} demande{item.requests.length > 1 ? "s" : ""}
                                    </Badge>
                                  </div>

                                  <div className="mt-3">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {item.requests.some((req) => req.type === "Ordinateur") && (
                                        <Badge variant="outline" className="flex items-center gap-1">
                                          <Laptop className="h-3 w-3" />
                                          {item.requests.filter((req) => req.type === "Ordinateur").length}{" "}
                                          Ordinateur(s)
                                        </Badge>
                                      )}
                                      {item.requests.some((req) => req.type === "Imprimante") && (
                                        <Badge variant="outline" className="flex items-center gap-1">
                                          <Printer className="h-3 w-3" />
                                          {item.requests.filter((req) => req.type === "Imprimante").length}{" "}
                                          Imprimante(s)
                                        </Badge>
                                      )}
                                    </div>

                                    {item.note && (
                                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                        <span className="font-medium">Note:</span> {item.note}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="bg-gray-50 p-4 sm:p-6 flex flex-row sm:flex-col justify-between items-center sm:border-l border-t sm:border-t-0">
                                  <Button variant="outline" className="text-sm" onClick={() => handleViewDetails(item)}>
                                    Voir détails
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Détails de l'envoi #{selectedRequest.batchId}</DialogTitle>
              <DialogDescription>Envoyé le {formatDate(selectedRequest.dateSent)}</DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {selectedRequest.note && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Note d'envoi:</span> {selectedRequest.note}
                  </p>
                </div>
              )}

              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-xs uppercase">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-xs uppercase">Quantité</th>
                      <th className="px-4 py-3 text-left font-medium text-xs uppercase">Spécifications</th>
                      <th className="px-4 py-3 text-left font-medium text-xs uppercase">Enseignant</th>
                      <th className="px-4 py-3 text-left font-medium text-xs uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.requests.map((request, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {request.type === "Ordinateur" ? (
                              <Laptop className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Printer className="h-4 w-4 text-blue-600" />
                            )}
                            {request.type}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-medium">
                            {request.quantite}
                          </div>
                        </td>
                        <td className="px-4 py-3">{request.specifications}</td>
                        <td className="px-4 py-3 text-blue-700">{request.teacher}</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-blue-100 text-blue-800 border border-blue-200">Envoyé</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DepartmentHeadLayout>
  )
}
