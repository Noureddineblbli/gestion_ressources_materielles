import { Skeleton } from "@/components/ui/skeleton"
import { ResourceManagerLayout } from "@/components/layout/resource-manager-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <ResourceManagerLayout title="Historique des offres" subtitle="Consulter l'historique des offres fournisseurs">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>

        <div className="space-y-6">
          <div>
            <Skeleton className="h-6 w-40 mb-4" />

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-full max-w-[250px]" />
                <Skeleton className="h-4 w-full max-w-[200px] mt-2" />
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Skeleton className="h-6 w-40 mb-4" />

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-full max-w-[250px]" />
                <Skeleton className="h-4 w-full max-w-[200px] mt-2" />
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ResourceManagerLayout>
  )
}
