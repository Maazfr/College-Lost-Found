"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MapPin, Calendar, Mail, Eye, MessageCircle, CheckCircle, Clock, AlertCircle, Phone } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

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
  reporter_phone?: string
  reporter_name?: string
}

interface ItemCardProps {
  item: Item
  onStatusUpdate?: () => void
  showAdminActions?: boolean
}

export function ItemCard({ item, onStatusUpdate, showAdminActions = false }: ItemCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "lost":
        return {
          color:
            "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20 dark:text-destructive-foreground",
          icon: AlertCircle,
          label: "Lost",
        }
      case "found":
        return {
          color: "bg-accent/10 text-accent border-accent/20 dark:bg-accent/20 dark:text-accent-foreground",
          icon: Clock,
          label: "Found",
        }
      case "claimed":
        return {
          color: "bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400",
          icon: CheckCircle,
          label: "Claimed",
        }
      default:
        return {
          color: "bg-muted text-muted-foreground",
          icon: Clock,
          label: "Unknown",
        }
    }
  }

  const handleStatusUpdate = async (newStatus: "lost" | "found" | "claimed") => {
    setIsUpdating(true)
    try {
      const { error } = await supabase.from("items").update({ status: newStatus }).eq("id", item.id)

      if (error) throw error

      if (onStatusUpdate) {
        onStatusUpdate()
      }
    } catch (error) {
      console.error("Error updating item status:", error)
      alert("Error updating item status. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleClaimItem = async () => {
    await handleStatusUpdate("claimed")
  }

  const handleContactOwner = () => {
    const [email, phone] = item.contactInfo.split(" | ")
    const subject = `Regarding ${item.title}`
    const body = `Hi, I saw your ${item.status} item listing for "${item.title}". I'm reaching out to help.`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const statusConfig = getStatusConfig(item.status)
  const StatusIcon = statusConfig.icon

  return (
    <Card
      className={`
        group cursor-pointer transition-all duration-300 ease-out
        hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1
        border-border/50 hover:border-primary/20 dark:hover:shadow-primary/10
        bg-card dark:bg-card
        ${isHovered ? "scale-[1.02]" : "scale-100"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-video relative bg-muted dark:bg-muted">
          <Image
            src={item.image || "/placeholder.svg?height=200&width=300&query=lost item"}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-black/50" />
        </div>

        <div className="absolute top-3 right-3">
          <Badge className={`${statusConfig.color} shadow-sm backdrop-blur-sm`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>

        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white text-foreground dark:bg-background/90 dark:hover:bg-background"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-background dark:bg-background">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <span>{item.title}</span>
                    <Badge className={statusConfig.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>Detailed information about this item</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-video relative bg-muted dark:bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg?height=200&width=300&query=lost item"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Description</h4>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{item.location}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{new Date(item.date).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{item.contactInfo.split(" | ")[0]}</span>
                      </div>

                      <div className="pt-3 border-t border-border space-y-2">
                        <p className="text-sm font-medium text-foreground">Reporter Contact Info:</p>
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{item.contactInfo.split(" | ")[0]}</span>
                        </div>
                        {item.contactInfo.split(" | ")[1] && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{item.contactInfo.split(" | ")[1]}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      {item.status === "found" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className="w-full bg-primary hover:bg-primary/90" disabled={isUpdating}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {isUpdating ? "Claiming..." : "Claim This Item"}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Claim this item?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to claim "{item.title}"? This will mark the item as claimed and
                                notify the person who found it.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleClaimItem}>Yes, Claim Item</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      <Button variant="outline" className="w-full bg-transparent" onClick={handleContactOwner}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact {item.status === "lost" ? "Owner" : "Finder"}
                      </Button>

                      {showAdminActions && (
                        <div className="pt-2 border-t space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Admin Actions:</p>
                          <div className="flex gap-2">
                            {item.status !== "lost" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate("lost")}
                                disabled={isUpdating}
                              >
                                Mark Lost
                              </Button>
                            )}
                            {item.status !== "found" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate("found")}
                                disabled={isUpdating}
                              >
                                Mark Found
                              </Button>
                            )}
                            {item.status !== "claimed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate("claimed")}
                                disabled={isUpdating}
                              >
                                Mark Claimed
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {item.status === "found" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isUpdating}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Claim
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Claim this item?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to claim "{item.title}"? This will mark the item as claimed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClaimItem}>Yes, Claim Item</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors duration-200">
              {item.title}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2">{item.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <Badge variant="outline" className="bg-transparent dark:bg-transparent">
              {item.category}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{item.location}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            {item.status === "found" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isUpdating}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {isUpdating ? "..." : "Claim"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Claim this item?</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to claim "{item.title}"?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClaimItem}>Yes, Claim Item</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button
              size="sm"
              variant="outline"
              className="flex-1 bg-transparent dark:bg-transparent"
              onClick={handleContactOwner}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
