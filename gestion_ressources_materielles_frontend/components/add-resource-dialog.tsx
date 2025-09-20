"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ScanBarcodeIcon as BarcodeScan } from "lucide-react"
import { AddSupplierForm } from "./add-supplier-form"

export interface SupplierData {
  id?: string
  name: string
  email?: string
  phone?: string
  address?: string
  website?: string
  contactPerson?: string
}

interface ResourceData {
  id: string
  type: string
  icon: string
  name: string
  brand: string
  supplier: string
}

interface AddResourceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddResource: (resource: ResourceData) => void
}

export function AddResourceDialog({ open, onOpenChange, onAddResource }: AddResourceDialogProps) {
  const [inventoryNumber, setInventoryNumber] = useState("INV-2025-6190")
  const [showSupplierForm, setShowSupplierForm] = useState(false)
  const [suppliers, setSuppliers] = useState([
    { id: "edusources", name: "EduSources" },
    { id: "scienceequip", name: "ScienceEquip" },
    { id: "techpro", name: "TechPro Solutions" },
  ])
  const [selectedSupplier, setSelectedSupplier] = useState("")

  // Form fields
  const [resourceName, setResourceName] = useState("")
  const [resourceType, setResourceType] = useState("ordinateur")
  const [resourceBrand, setResourceBrand] = useState("")
  const [resourceSpecs, setResourceSpecs] = useState("")
  const [quantity, setQuantity] = useState("1")

  const generateInventoryNumber = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(1000 + Math.random() * 9000)
    setInventoryNumber(`INV-${year}-${random}`)
  }

  const handleSupplierSelect = (value: string) => {
    if (value === "new") {
      setShowSupplierForm(true)
      setSelectedSupplier("")
    } else {
      setSelectedSupplier(value)
      setShowSupplierForm(false)
    }
  }

  const handleAddSupplier = (supplierData: SupplierData) => {
    const newSupplierId = supplierData.name.toLowerCase().replace(/\s+/g, "")
    const newSupplier = {
      id: newSupplierId,
      name: supplierData.name,
    }

    setSuppliers([...suppliers, newSupplier])
    setSelectedSupplier(newSupplierId)
    setShowSupplierForm(false)
  }

  const handleSubmit = () => {
    // Find the selected supplier name
    const supplierName = suppliers.find((s) => s.id === selectedSupplier)?.name || ""

    // Determine icon based on type
    const icon = resourceType === "ordinateur" ? "computer" : "printer"

    // Create new resource
    const newResource = {
      id: inventoryNumber,
      type:
        resourceType === "ordinateur"
          ? "Ordinateur"
          : resourceType === "imprimante"
            ? "Imprimante"
            : resourceType === "projecteur"
              ? "Projecteur"
              : resourceType === "tablette"
                ? "Tablette"
                : "Autre",
      icon,
      name: resourceName,
      brand: resourceBrand,
      supplier: supplierName,
    }

    // Pass to parent component
    onAddResource(newResource)

    // Reset form
    setResourceName("")
    setResourceBrand("")
    setResourceSpecs("")
    setSelectedSupplier("")
    generateInventoryNumber()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {!showSupplierForm ? (
          <>
            <DialogHeader>
              <DialogTitle>Ajouter une ressource livrée</DialogTitle>
              <DialogDescription>
                Enregistrez une nouvelle ressource livrée et attribuez-lui un numéro d&apos;inventaire.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de la ressource</Label>
                <Input id="name" value={resourceName} onChange={(e) => setResourceName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={resourceType} onValueChange={setResourceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ordinateur">Ordinateur</SelectItem>
                      <SelectItem value="imprimante">Imprimante</SelectItem>
                      <SelectItem value="projecteur">Projecteur</SelectItem>
                      <SelectItem value="tablette">Tablette</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="brand">Marque</Label>
                  <Input
                    id="brand"
                    placeholder="Ex: Dell"
                    value={resourceBrand}
                    onChange={(e) => setResourceBrand(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="specs">Spécifications</Label>
                <Textarea
                  id="specs"
                  placeholder="Ex: Intel Core i7, 16 Go, 512 Go SSD, 15.6 pouces"
                  className="resize-none"
                  value={resourceSpecs}
                  onChange={(e) => setResourceSpecs(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="inventory">Numéro d&apos;inventaire</Label>
                <div className="flex gap-2">
                  <Input id="inventory" value={inventoryNumber} onChange={(e) => setInventoryNumber(e.target.value)} />
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={generateInventoryNumber}
                    title="Générer un numéro"
                  >
                    <BarcodeScan className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Numéro unique pour identifier cette ressource</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="supplier">Fournisseur</Label>
                <Select value={selectedSupplier} onValueChange={handleSupplierSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="+ Ajouter un nouveau fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Ajouter un nouveau fournisseur</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantité</Label>
                <Select value={quantity} onValueChange={setQuantity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Pour les livraisons multiples du même article</p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                onClick={handleSubmit}
                disabled={!resourceName || !resourceBrand || !selectedSupplier}
              >
                Enregistrer la ressource
              </Button>
            </DialogFooter>
          </>
        ) : (
          <AddSupplierForm onCancel={() => setShowSupplierForm(false)} onSubmit={handleAddSupplier} />
        )}
      </DialogContent>
    </Dialog>
  )
}
