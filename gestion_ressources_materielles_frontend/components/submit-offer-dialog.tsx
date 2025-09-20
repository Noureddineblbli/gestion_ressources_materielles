"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

interface SubmitOfferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenderId: string
  tenderTitle: string
  items: Array<{
    name: string
    quantity: number
    specs: string
  }>
}

export function SubmitOfferDialog({ open, onOpenChange, tenderId, tenderTitle, items }: SubmitOfferDialogProps) {
  const { toast } = useToast()
  const router = useRouter()
  const { checkProfileComplete } = useAuth()

  const [formData, setFormData] = useState({
    deliveryDate: "",
    warrantyPeriod: "",
    items: [] as { brand: string; pricePerUnit: string }[],
  })

  const [isFormValid, setIsFormValid] = useState(false)

  // Initialize items when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        ...formData,
        items: items.map(() => ({ brand: "", pricePerUnit: "" })),
      })
    }
  }, [open, items])

  // Validate form
  useEffect(() => {
    if (!formData.deliveryDate || !formData.warrantyPeriod) {
      setIsFormValid(false)
      return
    }

    const allItemsValid = formData.items.every(
      (item) =>
        item.brand.trim() !== "" && item.pricePerUnit.trim() !== "" && !isNaN(Number.parseFloat(item.pricePerUnit)),
    )

    setIsFormValid(allItemsValid)
  }, [formData])

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    setFormData({
      ...formData,
      items: updatedItems,
    })
  }

  const calculateTotal = () => {
    return formData.items.reduce((total, item, index) => {
      const price = Number.parseFloat(item.pricePerUnit) || 0
      const quantity = items[index]?.quantity || 0
      return total + price * quantity
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if profile is complete before submitting
    if (!checkProfileComplete()) {
      onOpenChange(false)
      return
    }

    if (!isFormValid) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call
    toast({
      title: "Offre soumise avec succès",
      description: `Votre offre pour ${tenderTitle} a été enregistrée.`,
    })

    onOpenChange(false)
    router.push("/submitted-offers")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Soumettre une offre</DialogTitle>
          <DialogDescription>
            {tenderTitle} • Réf: {tenderId}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Date de livraison prévue</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warrantyPeriod">Période de garantie (mois)</Label>
              <Input
                id="warrantyPeriod"
                type="number"
                min="0"
                value={formData.warrantyPeriod}
                onChange={(e) => setFormData({ ...formData, warrantyPeriod: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Détails des équipements</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Équipement</th>
                    <th className="px-4 py-2 text-left font-medium">Quantité</th>
                    <th className="px-4 py-2 text-left font-medium">Marque</th>
                    <th className="px-4 py-2 text-left font-medium">Prix unitaire (€)</th>
                    <th className="px-4 py-2 text-left font-medium">Total (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">
                        <Input
                          value={formData.items[index]?.brand || ""}
                          onChange={(e) => handleItemChange(index, "brand", e.target.value)}
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.items[index]?.pricePerUnit || ""}
                          onChange={(e) => handleItemChange(index, "pricePerUnit", e.target.value)}
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
                        {(Number.parseFloat(formData.items[index]?.pricePerUnit || "0") * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/50">
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-right font-medium">
                      Total
                    </td>
                    <td className="px-4 py-2 font-medium">{calculateTotal().toFixed(2)} €</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Soumettre l'offre
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
