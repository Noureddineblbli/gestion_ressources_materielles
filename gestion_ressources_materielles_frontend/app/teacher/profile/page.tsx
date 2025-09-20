"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TeacherLayout } from "@/components/layout/teacher-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function TeacherProfile() {
  const { toast } = useToast()
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    office: "",
  })

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        department: user.department || "Département d'informatique",
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const isProfileComplete = () => {
    const requiredFields = ["name", "email", "phone", "department", "position", "office"]
    return requiredFields.every((field) => formData[field as keyof typeof formData]?.trim())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isProfileComplete()) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    // Update user profile completion status
    updateUser({
      ...formData,
      profileComplete: true,
    })

    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès.",
    })
  }

  return (
    <TeacherLayout title="Profil enseignant" subtitle="Gérez vos informations personnelles">
      {!user?.profileComplete && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profil incomplet</AlertTitle>
          <AlertDescription>
            Veuillez compléter votre profil pour accéder à toutes les fonctionnalités.
          </AlertDescription>
        </Alert>
      )}

      {user?.profileComplete && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Profil complet</AlertTitle>
          <AlertDescription>Votre profil est complet.</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nom complet <span className="text-red-500">*</span>
                </Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Téléphone <span className="text-red-500">*</span>
                </Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations professionnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department">
                  Département <span className="text-red-500">*</span>
                </Label>
                <Input id="department" name="department" value={formData.department} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">
                  Poste <span className="text-red-500">*</span>
                </Label>
                <Input id="position" name="position" value={formData.position} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="office">
                  Bureau <span className="text-red-500">*</span>
                </Label>
                <Input id="office" name="office" value={formData.office} onChange={handleChange} required />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline">
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </TeacherLayout>
  )
}
