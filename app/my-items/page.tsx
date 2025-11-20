"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Package, Clock, CheckCircle, XCircle, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Item {
  id: string
  title: string
  description: string
  category: string
  status: string
  created_at: string
  location: string
  img: string
}

export default function MyItemsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [myItems, setMyItems] = useState<Item[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUserAndFetchItems = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setIsAuthenticated(false)
          setLoading(false)
          return
        }

        setIsAuthenticated(true)

        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("*")
          .eq("reporter_id", user.id)
          .order("created_at", { ascending: false })

        if (itemsError) {
          console.error("Error fetching items:", itemsError)
        }

        setMyItems(itemsData || [])
      } catch (error) {
        console.error("Error fetching user items:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUserAndFetchItems()
  }, [supabase])

  const filteredItems = myItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "lost":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "found":
        return <Package className="h-4 w-4 text-blue-400" />
      case "claimed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      default:
        return <Clock className="h-4 w-4 text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lost":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "found":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "claimed":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your items...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 max-w-md w-full">
              <Package className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">My Items</h1>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Please log in to view and manage your lost and found items. Track your reports, check status updates,
                and manage your submissions.
              </p>

              <div className="space-y-4">
                <Link href="/auth/login">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                    <LogIn className="h-4 w-4 mr-2" />
                    Log In
                  </Button>
                </Link>

                <Link href="/auth/sign-up">
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                New to our platform? Create an account to start reporting and finding items.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Items</h1>
          <p className="text-gray-400">Manage your lost and found item reports</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search your items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-gray-900/50 border-gray-700 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="lost">Lost Items</SelectItem>
              <SelectItem value="found">Found Items</SelectItem>
              <SelectItem value="claimed">Claimed Items</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Items</p>
                  <p className="text-2xl font-bold text-white">{myItems.length}</p>
                </div>
                <Package className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Lost Items</p>
                  <p className="text-2xl font-bold text-red-400">
                    {myItems.filter((item) => item.status === "lost").length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Found Items</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {myItems.filter((item) => item.status === "found").length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Claimed</p>
                  <p className="text-2xl font-bold text-green-400">
                    {myItems.filter((item) => item.status === "claimed").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No items found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={item.img || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full sm:w-24 h-24 object-cover rounded-lg bg-gray-800"
                    />

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <Badge className={`w-fit ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1 capitalize">{item.status}</span>
                        </Badge>
                      </div>

                      <p className="text-gray-400 mb-3">{item.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>Category: {item.category}</span>
                        <span>Date: {new Date(item.created_at).toLocaleDateString()}</span>
                        <span>Location: {item.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                      >
                        View Details
                      </Button>
                      {item.status !== "claimed" && (
                        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                          Update Status
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
