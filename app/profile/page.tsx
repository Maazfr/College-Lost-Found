"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogIn, UserPlus, Package, Clock, CheckCircle, Award, Calendar } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

interface UserProfile {
  name: string
  email: string
  studentId: string
  joinDate: string
  avatar: string
  stats: {
    itemsReported: number
    itemsFound: number
    itemsReturned: number
    helpfulReports: number
  }
  recentActivity: Array<{
    type: string
    item: string
    date: string
  }>
  badges: Array<{
    name: string
    description: string
    icon: string
  }>
}

export default function ProfilePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUserAndFetchProfile = async () => {
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

        if (itemsError) {
          console.error("Error fetching items:", itemsError)
        }

        const items = itemsData || []
        const stats = {
          itemsReported: items.length,
          itemsFound: items.filter((item) => item.status === "found").length,
          itemsReturned: items.filter((item) => item.status === "claimed").length,
          helpfulReports: Math.floor(items.length * 0.5),
        }

        const profile: UserProfile = {
          name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
          email: user.email || "",
          studentId: user.user_metadata?.student_id || "STU" + user.id?.substring(0, 6).toUpperCase(),
          joinDate: new Date(user.created_at).toISOString().split("T")[0],
          avatar: user.user_metadata?.avatar_url || `/placeholder.svg?height=100&width=100`,
          stats,
          recentActivity: items.slice(0, 3).map((item) => ({
            type: item.status === "found" ? "found" : item.status === "claimed" ? "returned" : "reported",
            item: item.title,
            date: new Date(item.created_at).toISOString().split("T")[0],
          })),
          badges: [
            { name: "Helper", description: "Helped return 10+ items", icon: "🤝" },
            { name: "Reporter", description: "Reported 10+ lost items", icon: "📝" },
            { name: "Finder", description: "Found 5+ items", icon: "🔍" },
          ],
        }

        setUserData(profile)
        setFormData({
          firstName: profile.name.split(" ")[0],
          lastName: profile.name.split(" ")[1] || "",
          studentId: profile.studentId,
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUserAndFetchProfile()
  }, [supabase])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase.auth.updateUser({
        data: {
          name: `${formData.firstName} ${formData.lastName}`,
          student_id: formData.studentId,
        },
      })

      if (error) throw error

      setIsEditing(false)
      window.location.reload()
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Error saving profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
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
              <User className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">My Profile</h1>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Please log in to view your profile, track your activity, and manage your account settings.
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

              <p className="text-sm text-gray-500 mt-6">Join our community to help others find their lost items.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account and view your activity</p>
        </div>

        {/* Profile Header */}
        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <CardContent className="p-8">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">First Name</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Last Name</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Student ID</label>
                  <Input
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white mt-1"
                  />
                </div>
                <p className="text-sm text-gray-500">Email: {userData?.email}</p>
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-cyan-600 hover:bg-cyan-700">
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="bg-transparent border-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData?.avatar || "/placeholder.svg"} alt={userData?.name} />
                  <AvatarFallback className="bg-cyan-600 text-white text-xl">
                    {userData?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{userData?.name}</h2>
                  <p className="text-gray-400 mb-1">{userData?.email}</p>
                  <p className="text-gray-500 text-sm">Student ID: {userData?.studentId}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {userData?.joinDate && new Date(userData.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button onClick={() => setIsEditing(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  Edit Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{userData?.stats.itemsReported}</p>
              <p className="text-sm text-gray-400">Items Reported</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{userData?.stats.itemsFound}</p>
              <p className="text-sm text-gray-400">Items Found</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{userData?.stats.itemsReturned}</p>
              <p className="text-sm text-gray-400">Items Returned</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{userData?.stats.helpfulReports}</p>
              <p className="text-sm text-gray-400">Helpful Reports</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Badges */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Achievements</CardTitle>
              <CardDescription className="text-gray-400">Badges earned for your contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userData?.badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{badge.name}</p>
                      <p className="text-sm text-gray-400">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-400">Your latest lost and found activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userData?.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === "reported"
                          ? "bg-red-500/20"
                          : activity.type === "found"
                            ? "bg-blue-500/20"
                            : "bg-green-500/20"
                      }`}
                    >
                      {activity.type === "reported" && <Package className="h-4 w-4 text-red-400" />}
                      {activity.type === "found" && <CheckCircle className="h-4 w-4 text-blue-400" />}
                      {activity.type === "returned" && <Award className="h-4 w-4 text-green-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.item}</p>
                      <p className="text-sm text-gray-400 capitalize">
                        {activity.type} on {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
