"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface SupplierData {
  name: string
  email: string
  phone: string
  address: string
  website: string
  contactPerson: string
}

interface AddSupplierFormProps {
  onCancel: () => void
  onSubmit: (data: SupplierData) => void
}

export function AddSupplierForm({ onCancel, onSubmit }: AddSupplierFormProps) {
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
    onSubmit(formData)
  }

  return (
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

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="bg-black text-white hover:bg-gray-800">
          Ajouter le fournisseur
        </Button>
      </div>
    </form>
  )
}
