import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2 bg-gray-800" />
          <Skeleton className="h-4 w-64 bg-gray-800" />
        </div>

        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full bg-gray-800" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48 bg-gray-800" />
                <Skeleton className="h-4 w-64 bg-gray-800" />
                <Skeleton className="h-4 w-32 bg-gray-800" />
              </div>
              <Skeleton className="h-10 w-32 bg-gray-800" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full bg-gray-800" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-gray-800" />
                <Skeleton className="h-4 w-48 bg-gray-800" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-16 w-full bg-gray-800" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
