"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, RotateCcw, PenToolIcon as Tool, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BreakdownDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  breakdown: any
  onDownloadReport: (id: string) => void
  onReturnToSupplier: (id: string) => void
  onSendForRepair: (id: string) => void
  isLoading?: boolean
}

export function BreakdownDetailsDialog({
  isOpen,
  onClose,
  breakdown,
  onDownloadReport,
  onReturnToSupplier,
  onSendForRepair,
  isLoading = false,
}: BreakdownDetailsDialogProps) {
  if (!breakdown) return null

  const formatDate = (date: string) => {
    return date
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <ScrollArea className="max-h-[calc(90vh-4rem)] pr-4">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Détails de la panne</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">Informations détaillées sur la panne signalée</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => onDownloadReport(breakdown.id)}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Télécharger le rapport
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Left column */}
            <div>
              <h3 className="font-medium mb-2">Ressource concernée</h3>
              <div className="border rounded-md p-3 mb-4">
                <div className="flex items-center mb-2">
                  {breakdown.typeIcon === "laptop" ? (
                    <div className="h-5 w-5 text-blue-600 mr-2">💻</div>
                  ) : (
                    <div className="h-5 w-5 text-purple-600 mr-2">🖨️</div>
                  )}
                  <span className="font-medium">{breakdown.resource}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  N° d'inventaire: {breakdown.id}
                  <br />
                  Marque: {breakdown.resource.split(" ")[2]}
                </div>
              </div>

              <h3 className="font-medium mb-2">Signalé par</h3>
              <div className="border rounded-md p-3 mb-4">
                <div className="font-medium">{breakdown.reportedBy.name}</div>
                <div className="text-sm text-muted-foreground">
                  Département: {breakdown.reportedBy.department}
                  <br />
                  Date du signalement: {formatDate(breakdown.date)}
                </div>
              </div>

              <h3 className="font-medium mb-2">Technicien</h3>
              <div className="border rounded-md p-3 mb-4">
                <div className="font-medium">{breakdown.technician.name}</div>
                <div className="text-sm text-muted-foreground">
                  Spécialisation: {breakdown.technician.specialization}
                  <br />
                  Contact: {breakdown.technician.name.toLowerCase().replace(" ", ".")}@support.fr
                </div>
              </div>

              <h3 className="font-medium mb-2">Description de la panne</h3>
              <div className="border rounded-md p-3">
                <p className="text-sm">
                  {breakdown.description ||
                    "L'ordinateur s'éteint aléatoirement pendant l'utilisation, même lorsque la batterie est chargée. Cela se produit environ 2-3 fois par jour."}
                </p>
              </div>
            </div>

            {/* Right column */}
            <div>
              <h3 className="font-medium mb-2">Informations sur la panne</h3>
              <div className="border rounded-md p-3 mb-4">
                <div className="mb-2">
                  <span className="text-sm text-muted-foreground block mb-1">Fréquence:</span>
                  <Badge className="bg-amber-100 text-amber-800 border border-amber-200 rounded-full px-3 py-1 font-normal">
                    {breakdown.frequencyText}
                  </Badge>
                </div>
                <div className="mb-2">
                  <span className="text-sm text-muted-foreground block mb-1">Nature:</span>
                  <Badge className="bg-purple-100 text-purple-800 border border-purple-200 rounded-full px-3 py-1 font-normal flex items-center w-fit">
                    {breakdown.natureText}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block mb-1">Garantie:</span>
                  {breakdown.warranty === "valid" ? (
                    <div className="bg-green-100 text-green-800 border border-green-200 rounded-md p-2 text-sm">
                      ✓ Sous garantie jusqu'au {breakdown.warrantyEndDate || "20 octobre 2025"}
                    </div>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 border border-red-200 rounded-full px-3 py-1 font-normal">
                      ✗ {breakdown.warrantyText}
                    </Badge>
                  )}
                </div>
              </div>

              <h3 className="font-medium mb-2">Fournisseur</h3>
              <div className="border rounded-md p-3 mb-4">
                <div className="font-medium">{breakdown.supplier || "TechPro Solutions"}</div>
              </div>

              <h3 className="font-medium mb-2">Statut actuel</h3>
              <div className="border rounded-md p-3 mb-4">
                <Badge
                  className={`rounded-full px-3 py-1 font-normal ${
                    breakdown.status === "pending"
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : breakdown.status === "waiting_change" || breakdown.status === "waiting_repair"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-green-100 text-green-800 border border-green-200"
                  }`}
                >
                  {breakdown.statusText}
                  {breakdown.status === "changed" && breakdown.changeDate && ` le ${breakdown.changeDate}`}
                  {breakdown.status === "repaired" && breakdown.repairDate && ` le ${breakdown.repairDate}`}
                </Badge>
              </div>
            </div>
          </div>

          {breakdown.status === "pending" && (
            <div className="flex justify-end gap-3 mt-4">
              {breakdown.warranty === "valid" && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => onReturnToSupplier(breakdown.id)}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                  Retourner au fournisseur
                </Button>
              )}
              <Button
                variant="default"
                className="gap-2"
                onClick={() => onSendForRepair(breakdown.id)}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tool className="h-4 w-4" />}
                Envoyer en réparation
              </Button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
