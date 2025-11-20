"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Filter, Bell, Package, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { ItemCard } from "@/components/item-card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"

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

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
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
    const matchesTab = activeTab === "all" || item.status === activeTab
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

    return matchesSearch && matchesTab && matchesCategory
  })

  const stats = {
    total: items.length,
    lost: items.filter((item) => item.status === "lost").length,
    found: items.filter((item) => item.status === "found").length,
    claimed: items.filter((item) => item.status === "claimed").length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="animate-slide-in">
                <h1 className="text-2xl font-bold text-card-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Manage lost and found items</p>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Link href="/report">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Report Item
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Items</p>
                      <p className="text-2xl font-bold text-primary">{stats.total}</p>
                    </div>
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Lost Items</p>
                      <p className="text-2xl font-bold text-destructive">{stats.lost}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Found Items</p>
                      <p className="text-2xl font-bold text-accent">{stats.found}</p>
                    </div>
                    <Clock className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Claimed</p>
                      <p className="text-2xl font-bold text-green-600">{stats.claimed}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Search Items</CardTitle>
                <CardDescription>Find lost and found items across campus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by item name or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="shrink-0 bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["all", "Electronics", "Bags", "Personal Items", "Clothing", "Books"].map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer transition-all duration-200 hover:scale-105"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === "all" ? "All Categories" : category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Items Tabs */}
            <Card className="animate-fade-in">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b border-border px-6 pt-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
                      <TabsTrigger value="all">All Items</TabsTrigger>
                      <TabsTrigger value="lost">Lost</TabsTrigger>
                      <TabsTrigger value="found">Found</TabsTrigger>
                      <TabsTrigger value="claimed">Claimed</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value={activeTab} className="p-6">
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
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
                        <p className="text-muted-foreground">
                          {items.length === 0
                            ? "No items have been reported yet. Be the first to report an item!"
                            : "Try adjusting your search or filters"}
                        </p>
                        {items.length === 0 && (
                          <Link href="/report">
                            <Button className="mt-4">
                              <Plus className="h-4 w-4 mr-2" />
                              Report First Item
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
