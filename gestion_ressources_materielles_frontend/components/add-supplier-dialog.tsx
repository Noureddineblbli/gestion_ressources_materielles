"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface SupplierData {
  name: string
  email: string
  phone: string
  address: string
  website: string
  contactPerson: string
}

interface AddSupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddSupplier: (data: SupplierData) => void
}

export function AddSupplierDialog({ open, onOpenChange, onAddSupplier }: AddSupplierDialogProps) {
  const [formData, setFormData] = useState<SupplierData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    contactPerson: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddSupplier(formData)
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      contactPerson: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Informations du nouveau fournisseur</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de l&apos;entreprise</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: TechPro Solutions"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Ex: contact@entreprise.fr"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Ex: +33 1 23 45 67 89"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                name="address"
                placeholder="Ex: 15 Rue de l'Innovation, 75001 Paris"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                name="website"
                placeholder="Ex: https://entreprise.fr"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contactPerson">Nom du responsable</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                placeholder="Ex: Jean Dupont"
                value={formData.contactPerson}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-gray-800">
              Ajouter le fournisseur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
