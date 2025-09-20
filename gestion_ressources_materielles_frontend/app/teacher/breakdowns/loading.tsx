import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="mb-4">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="border rounded-md p-4">
        <div className="overflow-x-auto">
          <Skeleton className="h-8 w-full mb-4" />
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full mb-2" />
            ))}
        </div>
      </div>
    </div>
  )
}
