import type React from "react"
import TechnicianLayout from "@/components/layout/technician-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TechnicianLayout>{children}</TechnicianLayout>
}
