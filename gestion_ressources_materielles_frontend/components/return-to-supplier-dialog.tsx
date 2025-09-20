"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ReturnToSupplierDialogProps {
  isOpen: boolean
  onClose: () => void
  breakdown: any
  onConfirm: (id: string, data: any) => void
  isLoading?: boolean
}

export function ReturnToSupplierDialog({
  isOpen,
  onClose,
  breakdown,
  onConfirm,
  isLoading = false,
}: ReturnToSupplierDialogProps) {
  const [note, setNote] = useState("")
  const [error, setError] = useState("")

  if (!breakdown) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!note.trim()) {
      setError("Veuillez ajouter une note pour le retour")
      return
    }

    // Submit form
    onConfirm(breakdown.id, { note })
  }

  const resetForm = () => {
    setNote("")
    setError("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Retourner au fournisseur</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Vous êtes sur le point de retourner <strong>{breakdown?.resource}</strong> ({breakdown?.id}) au
                fournisseur <strong>{breakdown?.supplier}</strong> sous garantie.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Ajoutez une note concernant ce retour..."
                value={note}
                onChange={(e) => {
                  setNote(e.target.value)
                  if (e.target.value.trim()) setError("")
                }}
                className={error ? "border-red-500" : ""}
                rows={4}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                "Confirmer le retour"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
