"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

export default function Login() {
  const { login, isLoading } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      })
      return
    }

    try {
      await login(formData.email, formData.password)
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Email ou mot de passe incorrect.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Building className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Connexion Fournisseur</CardTitle>
          <CardDescription>Connectez-vous pour accéder à votre espace fournisseur</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Pas encore inscrit?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Créer un compte
              </Link>
            </p>
            <p className="text-sm text-center text-muted-foreground">
              Vous êtes un gestionnaire de ressources?{" "}
              <Link href="/login-resource-manager" className="text-primary hover:underline">
                Connexion gestionnaire
              </Link>
            </p>
            <p className="text-sm text-center text-muted-foreground">
              Vous êtes un enseignant?{" "}
              <Link href="/login-teacher" className="text-primary hover:underline">
                Connexion enseignant
              </Link>
            </p>
            <p className="text-sm text-center text-muted-foreground">
              Vous êtes un technicien?{" "}
              <Link href="/login-technician" className="text-primary hover:underline">
                Connexion technicien
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
