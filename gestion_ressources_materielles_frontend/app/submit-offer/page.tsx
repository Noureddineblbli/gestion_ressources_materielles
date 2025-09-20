"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SubmitOffer() {
  const router = useRouter()

  // Redirect to tenders page
  useEffect(() => {
    router.push("/tenders")
  }, [router])

  return null
}
