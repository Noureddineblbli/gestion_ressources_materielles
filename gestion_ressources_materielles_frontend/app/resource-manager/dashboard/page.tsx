"use client"

import { ResourceManagerLayout } from "@/components/layout/resource-manager-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ClipboardList, Truck, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function ResourceManagerDashboard() {
  return (
    <ResourceManagerLayout title="Tableau de bord" subtitle="Aperçu de la gestion des ressources">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Demandes des départements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 demandes envoyées, 2 en attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Offres en cours</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">8 soumissions reçues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Livraisons en attente</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">2 livraisons prévues cette semaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pannes signalées</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 panne critique à traiter</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Demandes récentes des départements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "REQ-2025-001", department: "Computer Science", head: "Dr. Alan Turing", status: "Envoyée" },
                { id: "REQ-2025-002", department: "Mathematics", head: "Dr. Katherine Johnson", status: "Envoyée" },
                { id: "REQ-2025-003", department: "Biology", head: "Dr. Charles Darwin", status: "Envoyée" },
              ].map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{request.department}</p>
                    <p className="text-sm text-muted-foreground">Chef: {request.head}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Réf: {request.id}</p>
                    <span className="status-badge status-accepted">{request.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/resource-manager/department-requests" className="text-sm text-primary hover:underline">
                Voir toutes les demandes
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Offres fournisseurs actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "OFR-2025-001", title: "Équipement informatique", deadline: "15 mai 2025", submissions: 3 },
                { id: "OFR-2025-002", title: "Mobilier de laboratoire", deadline: "22 mai 2025", submissions: 2 },
                { id: "OFR-2025-003", title: "Matériel audiovisuel", deadline: "30 mai 2025", submissions: 3 },
              ].map((offer) => (
                <div key={offer.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{offer.title}</p>
                    <p className="text-sm text-muted-foreground">Réf: {offer.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Date limite: {offer.deadline}</p>
                    <p className="text-sm text-muted-foreground">{offer.submissions} soumissions</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/resource-manager/submissions" className="text-sm text-primary hover:underline">
                Voir toutes les offres
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResourceManagerLayout>
  )
}
