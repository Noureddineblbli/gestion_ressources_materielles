"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText, Info } from "lucide-react"

interface TenderDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tender: any
  onSubmitOffer: (tender: any) => void
}

export function TenderDetailsDialog({ open, onOpenChange, tender, onSubmitOffer }: TenderDetailsDialogProps) {
  if (!tender) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{tender.title}</DialogTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> Date limite: {tender.deadline}
            </Badge>
          </div>
          <DialogDescription>
            Réf: {tender.id} • {tender.university}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p>{tender.description}</p>

          <div>
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
          </div>

          <div className="flex items-start gap-1 text-sm">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Conditions spéciales:</strong> {tender.conditions}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Publié le 1 avril 2025</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false)
              onSubmitOffer(tender)
            }}
          >
            Soumettre une offre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
