"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, Camera, MapPin, Package, AlertCircle, CheckCircle } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { EnhancedThemeToggle } from "@/components/enhanced-theme-toggle"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const categories = ["Electronics", "Bags", "Personal Items", "Clothing", "Books", "Accessories", "Other"]
const locations = [
  "Library",
  "Student Center",
  "Engineering Building",
  "Gym",
  "Cafeteria",
  "Dormitories",
  "Parking Lot",
  "Other",
]

export default function ReportPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    type: "lost",
    title: "",
    description: "",
    category: "",
    location: "",
    customLocation: "",
    date: "",
    contactEmail: "",
    contactPhone: "",
    image: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)
      setFormData((prev) => ({ ...prev, contactEmail: user.email || "" }))
      setLoading(false)
    }

    checkUser()
  }, [router, supabase.auth])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const finalLocation = formData.location === "Other" ? formData.customLocation : formData.location

      let imageUrl = null

      if (formData.image) {
        const fileExt = formData.image.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        const { error: uploadError, data } = await supabase.storage
          .from("item-images")
          .upload(`${user.id}/${fileName}`, formData.image)

        if (uploadError) throw uploadError

        // Get public URL for the uploaded image
        const {
          data: { publicUrl },
        } = supabase.storage.from("item-images").getPublicUrl(`${user.id}/${fileName}`)

        imageUrl = publicUrl
      }

      const { data, error } = await supabase.from("items").insert({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: finalLocation,
        date_reported: formData.date,
        status: formData.type,
        contact_info: formData.contactEmail + (formData.contactPhone ? ` | ${formData.contactPhone}` : ""),
        reporter_id: user.id,
        img: imageUrl, // Save the image URL to database
      })

      if (error) {
        throw error
      }

      setIsSubmitted(true)
    } catch (error: any) {
      alert(`Error submitting report: ${error?.message || "Please try again."}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <DashboardSidebar />
          <div className="flex-1 lg:ml-64">
            <header className="bg-card border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">Report Submitted</h1>
                  <p className="text-muted-foreground">Your item has been reported successfully</p>
                </div>
                <EnhancedThemeToggle />
              </div>
            </header>

            <div className="p-6 flex items-center justify-center min-h-[calc(100vh-120px)]">
              <Card className="w-full max-w-md animate-scale-in">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Successfully Submitted!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your {formData.type} item report has been submitted. You'll receive updates via email.
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        setIsSubmitted(false)
                        setFormData({
                          type: "lost",
                          title: "",
                          description: "",
                          category: "",
                          location: "",
                          customLocation: "",
                          date: "",
                          contactEmail: user?.email || "",
                          contactPhone: "",
                          image: null,
                        })
                      }}
                      className="w-full"
                    >
                      Report Another Item
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push("/dashboard")}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />

        <div className="flex-1 lg:ml-64">
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="animate-slide-in">
                <h1 className="text-2xl font-bold text-card-foreground">Report Item</h1>
                <p className="text-muted-foreground">Report a lost or found item</p>
              </div>
              <EnhancedThemeToggle />
            </div>
          </header>

          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Item Type */}
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Item Type
                    </CardTitle>
                    <CardDescription>Are you reporting a lost or found item?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value) => handleInputChange("type", value)}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="lost" id="lost" />
                        <Label htmlFor="lost" className="flex-1 cursor-pointer">
                          <div className="font-medium">Lost Item</div>
                          <div className="text-sm text-muted-foreground">I lost something</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="found" id="found" />
                        <Label htmlFor="found" className="flex-1 cursor-pointer">
                          <div className="font-medium">Found Item</div>
                          <div className="text-sm text-muted-foreground">I found something</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Item Details */}
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      Item Details
                    </CardTitle>
                    <CardDescription>Provide details about the item</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Item Name *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., iPhone 14 Pro, Blue Backpack"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide a detailed description including color, brand, distinctive features..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
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
                        <Label htmlFor="date">Date {formData.type === "lost" ? "Lost" : "Found"} *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange("date", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Location
                    </CardTitle>
                    <CardDescription>Where was the item {formData.type}?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
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

                    {formData.location === "Other" && (
                      <div className="space-y-2">
                        <Label htmlFor="customLocation">Specify Location</Label>
                        <Input
                          id="customLocation"
                          placeholder="Please specify the location"
                          value={formData.customLocation}
                          onChange={(e) => handleInputChange("customLocation", e.target.value)}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Image Upload */}
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="h-5 w-5 mr-2" />
                      Photo (Optional)
                    </CardTitle>
                    <CardDescription>Upload a photo to help identify the item</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {formData.image ? formData.image.name : "Click to upload or drag and drop"}
                        </p>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>How can people reach you about this item?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@college.edu"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button type="submit" className="w-full h-12 text-lg animate-fade-in" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : `Report ${formData.type === "lost" ? "Lost" : "Found"} Item`}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
