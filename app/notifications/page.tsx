"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, CheckCircle, Package, Trash2, MapPinnedIcon as MarkAsUnreadIcon, Settings } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { EnhancedThemeToggle } from "@/components/enhanced-theme-toggle"

interface Notification {
  id: string
  type: "match" | "update" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  itemId?: string
  actionRequired?: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "match",
    title: "Potential Match Found!",
    message: "Someone reported finding an iPhone 14 Pro that matches your lost item description.",
    timestamp: "2024-01-15T10:30:00Z",
    read: false,
    itemId: "item-123",
    actionRequired: true,
  },
  {
    id: "2",
    type: "update",
    title: "Item Status Updated",
    message: "Your reported blue backpack has been marked as claimed.",
    timestamp: "2024-01-14T15:45:00Z",
    read: false,
    itemId: "item-456",
  },
  {
    id: "3",
    type: "system",
    title: "Weekly Summary",
    message: "You have 2 active lost item reports and 1 found item report this week.",
    timestamp: "2024-01-14T09:00:00Z",
    read: true,
  },
  {
    id: "4",
    type: "match",
    title: "New Item Matches Your Search",
    message: "A red water bottle was found in the gym that matches your saved search criteria.",
    timestamp: "2024-01-13T14:20:00Z",
    read: true,
    itemId: "item-789",
  },
  {
    id: "5",
    type: "update",
    title: "Report Reminder",
    message: "Don't forget to update your lost MacBook Air report if you've found it.",
    timestamp: "2024-01-12T11:15:00Z",
    read: true,
    itemId: "item-321",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    if (activeTab === "matches") return notification.type === "match"
    if (activeTab === "updates") return notification.type === "update"
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "match":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "update":
        return <Package className="h-5 w-5 text-blue-500" />
      case "system":
        return <Bell className="h-5 w-5 text-orange-500" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />

        <div className="flex-1 lg:ml-64">
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="animate-slide-in">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-card-foreground">Notifications</h1>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="animate-pulse">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">Stay updated on your lost and found items</p>
              </div>
              <div className="flex items-center space-x-4">
                <EnhancedThemeToggle />
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead} className="bg-transparent">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6">
            <Card className="animate-fade-in">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b border-border px-6 pt-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
                      <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
                      <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                      <TabsTrigger value="matches">
                        Matches ({notifications.filter((n) => n.type === "match").length})
                      </TabsTrigger>
                      <TabsTrigger value="updates">
                        Updates ({notifications.filter((n) => n.type === "update").length})
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value={activeTab} className="p-6">
                    {filteredNotifications.length > 0 ? (
                      <div className="space-y-4">
                        {filteredNotifications.map((notification, index) => (
                          <Card
                            key={notification.id}
                            className={`animate-fade-in transition-all duration-200 hover:shadow-md ${
                              !notification.read ? "border-primary/50 bg-primary/5" : "hover:bg-accent/50"
                            }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h3 className={`font-semibold ${!notification.read ? "text-primary" : ""}`}>
                                        {notification.title}
                                      </h3>
                                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                      <div className="flex items-center space-x-4 mt-2">
                                        <span className="text-xs text-muted-foreground">
                                          {formatTimestamp(notification.timestamp)}
                                        </span>
                                        {notification.actionRequired && (
                                          <Badge variant="outline" className="text-xs">
                                            Action Required
                                          </Badge>
                                        )}
                                        {!notification.read && (
                                          <Badge variant="secondary" className="text-xs">
                                            New
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                      {!notification.read && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => markAsRead(notification.id)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <MarkAsUnreadIcon className="h-4 w-4" />
                                        </Button>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteNotification(notification.id)}
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  {notification.actionRequired && (
                                    <div className="mt-3 flex space-x-2">
                                      <Button size="sm" className="h-8">
                                        View Item
                                      </Button>
                                      <Button variant="outline" size="sm" className="h-8 bg-transparent">
                                        Contact Owner
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
                        <p className="text-muted-foreground">
                          {activeTab === "unread"
                            ? "All caught up! No unread notifications."
                            : "You don't have any notifications yet."}
                        </p>
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
