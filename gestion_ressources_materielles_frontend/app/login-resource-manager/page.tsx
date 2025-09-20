"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginResourceManager() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main resource manager login page
    router.push("/resource-manager")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirection vers la page de connexion du gestionnaire de ressources...</p>
    </div>
  )
}
