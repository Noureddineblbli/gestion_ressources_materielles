"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Check, Printer, Search, X, Bell, Laptop, FileText, FileDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
type BreakdownStatus = "pending" | "in_progress" | "resolved" | "critical"
type DeviceType = "computer" | "printer"
type BreakdownFrequency = "rare" | "frequent" | "permanent"
type BreakdownType = "software_system" | "software_utility" | "hardware"

interface Breakdown {
  id: string
  department: string
  teacher: string
  deviceType: DeviceType
  status: BreakdownStatus
  description: string
  reportedAt: Date
  isUrgent: boolean
  report?: {
    explanation: string
    occurrenceDate: Date
    frequency: BreakdownFrequency
    type: BreakdownType
  }
}

// Form validation errors
interface FormErrors {
  explanation: string
  occurrenceDate: string
  frequency: string
  type: string
}

// Mock data
const generateMockBreakdowns = (): Breakdown[] => {
  const departments = ["Informatique", "Mathématiques", "Physique", "Chimie", "Biologie"]
  const teachers = ["Jean Dupont", "Marie Curie", "Albert Einstein", "Isaac Newton", "Charles Darwin"]
  const statuses: BreakdownStatus[] = ["pending", "in_progress", "resolved", "critical"]
  const deviceTypes: DeviceType[] = ["computer", "printer"]
  const descriptions = [
    "L'ordinateur ne démarre plus après une mise à jour",
    "L'imprimante affiche une erreur de cartouche et refuse d'imprimer",
    "Écran bleu fréquent lors de l'utilisation de logiciels spécifiques",
    "L'ordinateur est extrêmement lent et se fige régulièrement",
    "L'imprimante fait un bruit anormal lors de l'impression",
    "Impossible d'accéder à certains sites web sur cet ordinateur",
    "L'imprimante imprime des pages avec des stries ou des taches",
    "Le clavier de l'ordinateur ne répond plus correctement",
    "L'écran de l'ordinateur affiche des couleurs anormales",
    "L'imprimante s'arrête au milieu des travaux d'impression",
  ]

  return Array.from({ length: 20 }, (_, i) => ({
    id: `BD-${1000 + i}`,
    department: departments[Math.floor(Math.random() * departments.length)],
    teacher: teachers[Math.floor(Math.random() * teachers.length)],
    deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    reportedAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)),
    isUrgent: Math.random() > 0.7,
    ...(Math.random() > 0.7 && {
      report: {
        explanation:
          "Défaillance détectée dans le système de " + (Math.random() > 0.5 ? "refroidissement" : "alimentation"),
        occurrenceDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        frequency: ["rare", "frequent", "permanent"][Math.floor(Math.random() * 3)] as BreakdownFrequency,
        type: ["software_system", "software_utility", "hardware"][Math.floor(Math.random() * 3)] as BreakdownType,
      },
    }),
  }))
}

// Helper functions
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

const getStatusBadge = (status: BreakdownStatus) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          En attente
        </Badge>
      )
    case "in_progress":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
          En cours
        </Badge>
      )
    case "resolved":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
          Résolu
        </Badge>
      )
    case "critical":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
          Panne grave
        </Badge>
      )
  }
}

const getStatusLabel = (status: BreakdownStatus): string => {
  switch (status) {
    case "pending":
      return "En attente"
    case "in_progress":
      return "En cours"
    case "resolved":
      return "Résolu"
    case "critical":
      return "Panne grave"
  }
}

export default function TechnicianDashboard() {
  const [breakdowns, setBreakdowns] = useState<Breakdown[]>([])
  const [filteredBreakdowns, setFilteredBreakdowns] = useState<Record<BreakdownStatus, Breakdown[]>>({
    pending: [],
    in_progress: [],
    resolved: [],
    critical: [],
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null)
  const [selectedBreakdown, setSelectedBreakdown] = useState<Breakdown | null>(null)
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false)
  const [isCriticalDialogOpen, setIsCriticalDialogOpen] = useState(false)
  const [isViewReportDialogOpen, setIsViewReportDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [resolutionNote, setResolutionNote] = useState("")
  const [criticalReport, setCriticalReport] = useState({
    explanation: "",
    occurrenceDate: new Date(),
    frequency: "frequent" as BreakdownFrequency,
    type: "hardware" as BreakdownType,
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({
    explanation: "",
    occurrenceDate: "",
    frequency: "",
    type: "",
  })
  const [hasNewNotification, setHasNewNotification] = useState(false)
  const [activeTab, setActiveTab] = useState<BreakdownStatus>("pending")
  const [expandedBreakdowns, setExpandedBreakdowns] = useState<Set<string>>(new Set())

  const { toast } = useToast()

  // Initialize data
  useEffect(() => {
    const data = generateMockBreakdowns()
    setBreakdowns(data)

    // Simulate a new breakdown notification after 10 seconds
    const timer = setTimeout(() => {
      setHasNewNotification(true)
      toast({
        title: "Nouvelle panne signalée",
        description: "Un enseignant vient de signaler une nouvelle panne.",
        variant: "default",
      })
    }, 10000)

    return () => clearTimeout(timer)
  }, [toast])

  // Apply filters
  useEffect(() => {
    // Group breakdowns by status
    const grouped: Record<BreakdownStatus, Breakdown[]> = {
      pending: [],
      in_progress: [],
      resolved: [],
      critical: [],
    }

    breakdowns.forEach((breakdown) => {
      let shouldInclude = true

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        shouldInclude =
          breakdown.department.toLowerCase().includes(query) ||
          breakdown.teacher.toLowerCase().includes(query) ||
          breakdown.description.toLowerCase().includes(query) ||
          breakdown.id.toLowerCase().includes(query)
      }

      // Apply department filter
      if (shouldInclude && departmentFilter) {
        shouldInclude = breakdown.department === departmentFilter
      }

      // Add to appropriate status group if it passes all filters
      if (shouldInclude) {
        grouped[breakdown.status].push(breakdown)
      }
    })

    setFilteredBreakdowns(grouped)
  }, [breakdowns, searchQuery, departmentFilter])

  // Handle mark as resolved
  const handleMarkAsResolved = (breakdown: Breakdown) => {
    setSelectedBreakdown(breakdown)
    setIsResolveDialogOpen(true)
  }

  // Handle mark as critical
  const handleMarkAsCritical = (breakdown: Breakdown) => {
    setSelectedBreakdown(breakdown)
    // Initialize with default values based on device type
    setCriticalReport({
      explanation: "",
      occurrenceDate: new Date(),
      frequency: "frequent",
      type: breakdown.deviceType === "printer" ? "hardware" : "software_system",
    })
    // Reset form errors
    setFormErrors({
      explanation: "",
      occurrenceDate: "",
      frequency: "",
      type: "",
    })
    setIsCriticalDialogOpen(true)
  }

  // Handle view details
  const handleViewDetails = (breakdown: Breakdown) => {
    setSelectedBreakdown(breakdown)
    // Initialize with existing report data or default values
    if (breakdown.report) {
      setCriticalReport({
        explanation: breakdown.report.explanation,
        occurrenceDate: breakdown.report.occurrenceDate,
        frequency: breakdown.report.frequency,
        type: breakdown.report.type,
      })
    } else {
      setCriticalReport({
        explanation: "",
        occurrenceDate: new Date(),
        frequency: "frequent",
        type: breakdown.deviceType === "printer" ? "hardware" : "software_system",
      })
    }
    // Reset form errors
    setFormErrors({
      explanation: "",
      occurrenceDate: "",
      frequency: "",
      type: "",
    })
    setIsDetailsDialogOpen(true)
  }

  // Handle view report
  const handleViewReport = (breakdown: Breakdown) => {
    // Toggle expanded state
    setExpandedBreakdowns((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(breakdown.id)) {
        newSet.delete(breakdown.id)
      } else {
        newSet.add(breakdown.id)
      }
      return newSet
    })
  }

  // Validate form
  const validateForm = (): boolean => {
    const errors: FormErrors = {
      explanation: "",
      occurrenceDate: "",
      frequency: "",
      type: "",
    }

    let isValid = true

    // Check explanation
    if (!criticalReport.explanation.trim()) {
      errors.explanation = "L'explication est requise"
      isValid = false
    }

    // Check date
    if (!criticalReport.occurrenceDate) {
      errors.occurrenceDate = "La date d'apparition est requise"
      isValid = false
    }

    // Check frequency
    if (!criticalReport.frequency) {
      errors.frequency = "La fréquence est requise"
      isValid = false
    }

    // Check type for computers
    if (selectedBreakdown?.deviceType === "computer" && !criticalReport.type) {
      errors.type = "Le type de panne est requis"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  // Confirm resolution
  const confirmResolution = () => {
    if (!selectedBreakdown) return

    const updatedBreakdowns = breakdowns.map((bd) => {
      if (bd.id === selectedBreakdown.id) {
        return { ...bd, status: "resolved" as BreakdownStatus }
      }
      return bd
    })

    setBreakdowns(updatedBreakdowns)
    setIsResolveDialogOpen(false)
    setResolutionNote("")

    toast({
      title: "Panne marquée comme résolue",
      description: `La panne ${selectedBreakdown.id} a été marquée comme résolue.`,
      variant: "default",
    })
  }

  // Confirm critical
  const confirmCritical = () => {
    if (!selectedBreakdown) return

    // Validate form
    if (!validateForm()) {
      return
    }

    const updatedBreakdowns = breakdowns.map((bd) => {
      if (bd.id === selectedBreakdown.id) {
        return {
          ...bd,
          status: "critical" as BreakdownStatus,
          isUrgent: true,
          report: { ...criticalReport },
        }
      }
      return bd
    })

    setBreakdowns(updatedBreakdowns)
    setIsCriticalDialogOpen(false)

    toast({
      title: "Constat de panne grave enregistré",
      description: `Le constat pour la panne ${selectedBreakdown.id} a été enregistré.`,
      variant: "destructive",
    })
  }

  // Save report
  const saveReport = () => {
    if (!selectedBreakdown) return

    // Validate form
    if (!validateForm()) {
      return
    }

    const updatedBreakdowns = breakdowns.map((bd) => {
      if (bd.id === selectedBreakdown.id) {
        return {
          ...bd,
          report: { ...criticalReport },
        }
      }
      return bd
    })

    setBreakdowns(updatedBreakdowns)
    setIsCriticalDialogOpen(false)

    toast({
      title: "Constat enregistré",
      description: `Le constat pour la panne ${selectedBreakdown.id} a été enregistré.`,
      variant: "default",
    })
  }

  // Save details
  const saveDetails = () => {
    if (!selectedBreakdown) return

    // Validate form
    if (!validateForm()) {
      return
    }

    const updatedBreakdowns = breakdowns.map((bd) => {
      if (bd.id === selectedBreakdown.id) {
        return {
          ...bd,
          report: { ...criticalReport },
        }
      }
      return bd
    })

    setBreakdowns(updatedBreakdowns)
    setIsDetailsDialogOpen(false)

    toast({
      title: "Détails enregistrés",
      description: `Les détails pour la panne ${selectedBreakdown.id} ont été enregistrés.`,
      variant: "default",
    })
  }

  // Handle PDF download
  const handleDownloadPDF = () => {
    if (!selectedBreakdown) return

    toast({
      title: "Téléchargement du PDF",
      description: `Le constat de la panne ${selectedBreakdown.id} est en cours de téléchargement.`,
      variant: "default",
    })

    // In a real application, this would generate and download a PDF
    setTimeout(() => {
      toast({
        title: "Téléchargement terminé",
        description: "Le fichier PDF a été téléchargé avec succès.",
        variant: "default",
      })
    }, 1500)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setDepartmentFilter(null)
  }

  // Get unique departments for filter
  const departments = [...new Set(breakdowns.map((bd) => bd.department))]

  // Format breakdown type for display
  const formatBreakdownType = (type: BreakdownType): string => {
    switch (type) {
      case "software_system":
        return "Logiciel - Système"
      case "software_utility":
        return "Logiciel - Utilitaire"
      case "hardware":
        return "Matériel"
    }
  }

  // Format breakdown frequency for display
  const formatBreakdownFrequency = (frequency: BreakdownFrequency): string => {
    switch (frequency) {
      case "rare":
        return "Rare"
      case "frequent":
        return "Fréquente"
      case "permanent":
        return "Permanente"
    }
  }

  // Render breakdown table for a specific status
  const renderBreakdownTable = (status: BreakdownStatus) => {
    const breakdownsToShow = filteredBreakdowns[status]

    return (
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Enseignant</TableHead>
              <TableHead>Appareil</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breakdownsToShow.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  Aucune panne {getStatusLabel(status).toLowerCase()} trouvée
                </TableCell>
              </TableRow>
            ) : (
              breakdownsToShow.map((breakdown, index) => (
                <>
                  <TableRow
                    key={breakdown.id}
                    className={`${index % 2 === 0 ? "bg-muted/50" : ""} ${
                      breakdown.isUrgent ? "border-l-4 border-red-500" : ""
                    }`}
                  >
                    <TableCell className="font-medium">{breakdown.id}</TableCell>
                    <TableCell>{breakdown.department}</TableCell>
                    <TableCell>{breakdown.teacher}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {breakdown.deviceType === "computer" ? (
                          <Laptop className="h-4 w-4" />
                        ) : (
                          <Printer className="h-4 w-4" />
                        )}
                        {breakdown.deviceType === "computer" ? "Ordinateur" : "Imprimante"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="line-clamp-1 max-w-[200px] block">{breakdown.description}</span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>{breakdown.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{formatDate(breakdown.reportedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => handleMarkAsResolved(breakdown)}
                            >
                              <Check className="h-4 w-4" />
                              <span className="hidden sm:inline">Réparer</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleMarkAsCritical(breakdown)}
                            >
                              <AlertTriangle className="h-4 w-4" />
                              <span className="hidden sm:inline">Panne grave</span>
                            </Button>
                          </>
                        )}

                        {status === "critical" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => handleMarkAsResolved(breakdown)}
                            >
                              <Check className="h-4 w-4" />
                              <span className="hidden sm:inline">Réparer</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1"
                              onClick={() => handleViewReport(breakdown)}
                            >
                              <FileText className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                {expandedBreakdowns.has(breakdown.id) ? "Masquer détails" : "Voir le constat"}
                              </span>
                            </Button>
                          </>
                        )}

                        {status === "resolved" &&
                          (breakdown.report ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1"
                              onClick={() => handleViewReport(breakdown)}
                            >
                              <FileText className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                {expandedBreakdowns.has(breakdown.id) ? "Masquer détails" : "Voir le constat"}
                              </span>
                            </Button>
                          ) : (
                            <span className="text-sm text-muted-foreground">Réparé sur place</span>
                          ))}
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedBreakdowns.has(breakdown.id) && breakdown.report && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-gray-50 p-4">
                        <div className="space-y-4">
                          <h3 className="font-medium text-lg">Détails du constat</h3>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Département</h4>
                              <p>{breakdown.department}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Enseignant</h4>
                              <p>{breakdown.teacher}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Description initiale</h4>
                            <p>{breakdown.description}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Explication de la panne</h4>
                            <p>{breakdown.report.explanation}</p>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Date d'apparition</h4>
                              <p>{formatDate(breakdown.report.occurrenceDate)}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Fréquence</h4>
                              <p>{formatBreakdownFrequency(breakdown.report.frequency)}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Type de panne</h4>
                              <p>{formatBreakdownType(breakdown.report.type)}</p>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadPDF}>
                              <FileDown className="h-4 w-4" />
                              Télécharger PDF
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des pannes</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="relative" onClick={() => setHasNewNotification(false)}>
            <Bell className="h-5 w-5" />
            {hasNewNotification && <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500"></span>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={activeTab === "pending" ? "ring-2 ring-yellow-500" : ""}>
          <CardHeader className="pb-2">
            <CardTitle>En attente</CardTitle>
            <CardDescription>Pannes à traiter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{filteredBreakdowns.pending.length}</div>
          </CardContent>
        </Card>
        <Card className={activeTab === "critical" ? "ring-2 ring-red-500" : ""}>
          <CardHeader className="pb-2">
            <CardTitle>Pannes graves</CardTitle>
            <CardDescription>Nécessitent attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{filteredBreakdowns.critical.length}</div>
          </CardContent>
        </Card>
        <Card className={activeTab === "resolved" ? "ring-2 ring-green-500" : ""}>
          <CardHeader className="pb-2">
            <CardTitle>Résolues</CardTitle>
            <CardDescription>Pannes réparées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{filteredBreakdowns.resolved.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des pannes</CardTitle>
          <CardDescription>Gérez les pannes signalées par les enseignants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={departmentFilter || "all"}
                  onValueChange={(value) => setDepartmentFilter(value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les départements</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(searchQuery || departmentFilter) && (
                  <Button variant="ghost" size="icon" onClick={clearFilters}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <Tabs
              defaultValue="pending"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as BreakdownStatus)}
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800"
                >
                  En attente
                </TabsTrigger>
                <TabsTrigger
                  value="critical"
                  className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800"
                >
                  Pannes graves
                </TabsTrigger>
                <TabsTrigger
                  value="resolved"
                  className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
                >
                  Résolues
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pending">{renderBreakdownTable("pending")}</TabsContent>
              <TabsContent value="critical">{renderBreakdownTable("critical")}</TabsContent>
              <TabsContent value="resolved">{renderBreakdownTable("resolved")}</TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Resolve Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la réparation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir marquer cette panne comme résolue ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Détails de la panne</h4>
              <div className="rounded-md bg-muted p-4">
                <p>
                  <strong>ID:</strong> {selectedBreakdown?.id}
                </p>
                <p>
                  <strong>Département:</strong> {selectedBreakdown?.department}
                </p>
                <p>
                  <strong>Enseignant:</strong> {selectedBreakdown?.teacher}
                </p>
                <p>
                  <strong>Description:</strong> {selectedBreakdown?.description}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="resolution-note" className="text-sm font-medium">
                Note de résolution (optionnel)
              </label>
              <Textarea
                id="resolution-note"
                placeholder="Décrivez comment vous avez résolu le problème..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={confirmResolution}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Critical Breakdown Report Dialog */}
      <Dialog open={isCriticalDialogOpen} onOpenChange={setIsCriticalDialogOpen}>
        <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white pb-2 z-10">
            <DialogTitle>Constat de panne</DialogTitle>
            <DialogDescription>Veuillez remplir les détails de la panne</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Détails de la panne</h4>
              <div className="rounded-md bg-muted p-2 text-sm">
                <p>
                  <strong>ID:</strong> {selectedBreakdown?.id}
                </p>
                <p>
                  <strong>Département:</strong> {selectedBreakdown?.department}
                </p>
                <p>
                  <strong>Enseignant:</strong> {selectedBreakdown?.teacher}
                </p>
                <p>
                  <strong>Appareil:</strong>{" "}
                  {selectedBreakdown?.deviceType === "computer" ? "Ordinateur" : "Imprimante"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="explanation" className="text-sm font-medium">
                  Explication <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="explanation"
                  placeholder="Décrivez la panne..."
                  value={criticalReport.explanation}
                  onChange={(e) => setCriticalReport({ ...criticalReport, explanation: e.target.value })}
                  className="min-h-[80px]"
                />
                {formErrors.explanation && <p className="text-xs text-red-500">{formErrors.explanation}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="occurrenceDate" className="text-sm font-medium">
                  Date d'apparition <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="occurrenceDate"
                  type="date"
                  value={criticalReport.occurrenceDate.toISOString().split("T")[0]}
                  onChange={(e) => setCriticalReport({ ...criticalReport, occurrenceDate: new Date(e.target.value) })}
                />
                {formErrors.occurrenceDate && <p className="text-xs text-red-500">{formErrors.occurrenceDate}</p>}
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  Fréquence <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={criticalReport.frequency}
                  onValueChange={(value) =>
                    setCriticalReport({ ...criticalReport, frequency: value as BreakdownFrequency })
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="rare" id="rare" />
                    <Label htmlFor="rare" className="text-sm">
                      Rare
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="frequent" id="frequent" />
                    <Label htmlFor="frequent" className="text-sm">
                      Fréquente
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="permanent" id="permanent" />
                    <Label htmlFor="permanent" className="text-sm">
                      Permanente
                    </Label>
                  </div>
                </RadioGroup>
                {formErrors.frequency && <p className="text-xs text-red-500">{formErrors.frequency}</p>}
              </div>

              {selectedBreakdown?.deviceType === "computer" && (
                <div className="space-y-1">
                  <Label className="text-sm font-medium">
                    Type de panne <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={criticalReport.type}
                    onValueChange={(value) => setCriticalReport({ ...criticalReport, type: value as BreakdownType })}
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="software_system" id="software_system" />
                      <Label htmlFor="software_system" className="text-sm">
                        Logiciel - Système
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="software_utility" id="software_utility" />
                      <Label htmlFor="software_utility" className="text-sm">
                        Logiciel - Utilitaire
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="hardware" id="hardware" />
                      <Label htmlFor="hardware" className="text-sm">
                        Matériel
                      </Label>
                    </div>
                  </RadioGroup>
                  {formErrors.type && <p className="text-xs text-red-500">{formErrors.type}</p>}
                </div>
              )}
              {selectedBreakdown?.deviceType === "printer" && (
                <div className="rounded-md bg-blue-50 p-2 text-blue-800 text-xs">
                  <p>Les pannes d'imprimantes sont uniquement d'ordre matériel.</p>
                </div>
              )}

              {/* Bouton Enregistrer placé directement sous le formulaire */}
              <div className="pt-4">
                <Button
                  variant="default"
                  onClick={saveReport}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2"
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsCriticalDialogOpen(false)} size="sm">
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de la panne</DialogTitle>
            <DialogDescription>Complétez les informations sur cette panne.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Informations générales</h4>
              <div className="rounded-md bg-muted p-4 mb-4">
                <p>
                  <strong>ID:</strong> {selectedBreakdown?.id}
                </p>
                <p>
                  <strong>Département:</strong> {selectedBreakdown?.department}
                </p>
                <p>
                  <strong>Enseignant:</strong> {selectedBreakdown?.teacher}
                </p>
                <p>
                  <strong>Appareil:</strong>{" "}
                  {selectedBreakdown?.deviceType === "computer" ? "Ordinateur" : "Imprimante"}
                </p>
                <p>
                  <strong>Description initiale:</strong> {selectedBreakdown?.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="explanation" className="font-medium">
                  Explication de la panne <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="explanation"
                  placeholder="Décrivez en détail la nature de la panne..."
                  value={criticalReport.explanation}
                  onChange={(e) => setCriticalReport({ ...criticalReport, explanation: e.target.value })}
                  className="min-h-[100px]"
                />
                {formErrors.explanation && <p className="text-sm text-red-500 mt-1">{formErrors.explanation}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="occurrenceDate" className="font-medium">
                  Date d'apparition <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="occurrenceDate"
                  type="date"
                  value={criticalReport.occurrenceDate.toISOString().split("T")[0]}
                  onChange={(e) => setCriticalReport({ ...criticalReport, occurrenceDate: new Date(e.target.value) })}
                />
                {formErrors.occurrenceDate && <p className="text-sm text-red-500 mt-1">{formErrors.occurrenceDate}</p>}
              </div>

              <div className="space-y-2">
                <Label className="font-medium">
                  Fréquence <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={criticalReport.frequency}
                  onValueChange={(value) =>
                    setCriticalReport({ ...criticalReport, frequency: value as BreakdownFrequency })
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rare" id="details-rare" />
                    <Label htmlFor="details-rare">Rare</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="frequent" id="details-frequent" />
                    <Label htmlFor="details-frequent">Fréquente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="permanent" id="details-permanent" />
                    <Label htmlFor="details-permanent">Permanente</Label>
                  </div>
                </RadioGroup>
                {formErrors.frequency && <p className="text-sm text-red-500 mt-1">{formErrors.frequency}</p>}
              </div>

              {selectedBreakdown?.deviceType === "computer" && (
                <div className="space-y-2">
                  <Label className="font-medium">
                    Type de panne <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={criticalReport.type}
                    onValueChange={(value) => setCriticalReport({ ...criticalReport, type: value as BreakdownType })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="software_system" id="details-software_system" />
                      <Label htmlFor="details-software_system">Logiciel - Défaut du système</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="software_utility" id="details-software_utility" />
                      <Label htmlFor="details-software_utility">Logiciel - Défaut d'un utilitaire</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hardware" id="details-hardware" />
                      <Label htmlFor="details-hardware">Matériel</Label>
                    </div>
                  </RadioGroup>
                  {formErrors.type && <p className="text-sm text-red-500 mt-1">{formErrors.type}</p>}
                </div>
              )}
              {selectedBreakdown?.deviceType === "printer" && (
                <div className="rounded-md bg-blue-50 p-4 text-blue-800">
                  <p className="text-sm">Les pannes d'imprimantes sont uniquement d'ordre matériel.</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={saveDetails}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog open={isViewReportDialogOpen} onOpenChange={setIsViewReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Constat de panne</DialogTitle>
            <DialogDescription>Détails du constat de panne pour {selectedBreakdown?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedBreakdown?.report && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Département</h4>
                    <p>{selectedBreakdown.department}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Enseignant</h4>
                    <p>{selectedBreakdown.teacher}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Description initiale</h4>
                  <p>{selectedBreakdown.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Explication de la panne</h4>
                  <p>{selectedBreakdown.report.explanation}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Date d'apparition</h4>
                    <p>{formatDate(selectedBreakdown.report.occurrenceDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Fréquence</h4>
                    <p>{formatBreakdownFrequency(selectedBreakdown.report.frequency)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Type de panne</h4>
                    <p>{formatBreakdownType(selectedBreakdown.report.type)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDownloadPDF} className="gap-2">
              <FileDown className="h-4 w-4" />
              Télécharger PDF
            </Button>
            <Button onClick={() => setIsViewReportDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
