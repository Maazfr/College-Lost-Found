"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, MapPin, Calendar, Package, SlidersHorizontal } from "lucide-react"
import { ItemCard } from "@/components/item-card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { EnhancedThemeToggle } from "@/components/enhanced-theme-toggle"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const locations = [
  "All Locations",
  "Library",
  "Student Center",
  "Engineering Building",
  "Gym",
  "Cafeteria",
  "Dormitories",
  "Parking Lot",
]

const categories = ["All Categories", "Electronics", "Bags", "Personal Items", "Clothing", "Books", "Accessories"]

interface Item {
  id: string
  title: string
  description: string
  category: string
  location: string
  date: string
  status: "lost" | "found" | "claimed"
  image: string
  contactInfo: string
}

export default function SearchPage() {
  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dateRange, setDateRange] = useState([7])
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUserAndFetchItems = async () => {
      // Check authentication
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)

      // Fetch items from database
      const { data: itemsData, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching items:", error)
      } else {
        // Transform database items to match component interface
        const transformedItems =
          itemsData?.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            category: item.category,
            location: item.location,
            date: item.date_reported,
            status: item.status,
            image: item.image_url || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(item.title)}`,
            contactInfo: item.contact_info,
          })) || []

        setItems(transformedItems)
      }

      setLoading(false)
    }

    checkUserAndFetchItems()
  }, [router, supabase])

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory
    const matchesLocation = selectedLocation === "All Locations" || item.location.includes(selectedLocation)
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus

    // Date filter (last N days)
    const itemDate = new Date(item.date)
    const daysDiff = Math.floor((Date.now() - itemDate.getTime()) / (1000 * 60 * 60 * 24))
    const matchesDate = daysDiff <= dateRange[0]

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus && matchesDate
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading search...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />

        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="animate-slide-in">
                <h1 className="text-2xl font-bold text-card-foreground">Search Items</h1>
                <p className="text-muted-foreground">Find lost and found items across campus</p>
              </div>
              <div className="flex items-center space-x-4">
                <EnhancedThemeToggle />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-transparent"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide" : "Show"} Filters
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Search Bar */}
            <Card className="animate-fade-in">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for lost or found items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Filters */}
            {showFilters && (
              <Card className="animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Advanced Filters
                  </CardTitle>
                  <CardDescription>Narrow down your search with specific criteria</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                          <SelectItem value="found">Found</SelectItem>
                          <SelectItem value="claimed">Claimed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range (Last {dateRange[0]} days)</label>
                      <Slider
                        value={dateRange}
                        onValueChange={setDateRange}
                        max={30}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                      <MapPin className="h-3 w-3 mr-1" />
                      {selectedLocation}
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                      <Package className="h-3 w-3 mr-1" />
                      {selectedCategory}
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                      <Calendar className="h-3 w-3 mr-1" />
                      Last {dateRange[0]} days
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>
                  Found {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} matching your criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item, index) => (
                      <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <ItemCard item={item} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
                    <p className="text-muted-foreground">
                      {items.length === 0
                        ? "No items have been reported yet."
                        : "Try adjusting your search criteria or filters"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
