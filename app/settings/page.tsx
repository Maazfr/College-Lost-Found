"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, Shield, Palette, Smartphone, Mail, Lock, Eye, EyeOff, Camera, Save, Trash2 } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { EnhancedThemeToggle } from "@/components/enhanced-theme-toggle"

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    // Profile
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@college.edu",
    phone: "(555) 123-4567",
    studentId: "STU123456",

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    matchAlerts: true,
    weeklyDigest: false,
    smsNotifications: false,

    // Privacy
    profileVisibility: "public",
    showContactInfo: true,
    allowDirectMessages: true,

    // Preferences
    language: "en",
    timezone: "America/New_York",
    itemsPerPage: "12",
    defaultView: "grid",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Simulate saving settings
    console.log("Settings saved:", settings)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />

        <div className="flex-1 lg:ml-64">
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="animate-slide-in">
                <h1 className="text-2xl font-bold text-card-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences</p>
              </div>
              <div className="flex items-center space-x-4">
                <EnhancedThemeToggle />
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <span className="hidden sm:inline">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Privacy</span>
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="flex items-center space-x-2">
                    <Palette className="h-4 w-4" />
                    <span className="hidden sm:inline">Preferences</span>
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your personal information and profile picture</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Profile Picture */}
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src="/placeholder.svg?height=80&width=80" />
                          <AvatarFallback className="text-lg">
                            {settings.firstName[0]}
                            {settings.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Camera className="h-4 w-4 mr-2" />
                            Change Photo
                          </Button>
                          <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Personal Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={settings.firstName}
                            onChange={(e) => handleSettingChange("firstName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={settings.lastName}
                            onChange={(e) => handleSettingChange("lastName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={settings.email}
                            onChange={(e) => handleSettingChange("email", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={settings.phone}
                            onChange={(e) => handleSettingChange("phone", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="studentId">Student ID</Label>
                          <Input
                            id="studentId"
                            value={settings.studentId}
                            onChange={(e) => handleSettingChange("studentId", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Security</CardTitle>
                      <CardDescription>Manage your password and security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" placeholder="Enter new password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                      </div>
                      <Button variant="outline" className="bg-transparent">
                        <Lock className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Choose how you want to be notified about updates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <Label>Email Notifications</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <Smartphone className="h-4 w-4" />
                              <Label>Push Notifications</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                          </div>
                          <Switch
                            checked={settings.pushNotifications}
                            onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Match Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when potential matches are found
                            </p>
                          </div>
                          <Switch
                            checked={settings.matchAlerts}
                            onCheckedChange={(checked) => handleSettingChange("matchAlerts", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Weekly Digest</Label>
                            <p className="text-sm text-muted-foreground">Receive a weekly summary of activity</p>
                          </div>
                          <Switch
                            checked={settings.weeklyDigest}
                            onCheckedChange={(checked) => handleSettingChange("weeklyDigest", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>SMS Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive important updates via SMS</p>
                          </div>
                          <Switch
                            checked={settings.smsNotifications}
                            onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy" className="space-y-6">
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>Control who can see your information and contact you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Profile Visibility</Label>
                          <Select
                            value={settings.profileVisibility}
                            onValueChange={(value) => handleSettingChange("profileVisibility", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                              <SelectItem value="students">Students Only - Only verified students</SelectItem>
                              <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Show Contact Information</Label>
                            <p className="text-sm text-muted-foreground">Allow others to see your contact details</p>
                          </div>
                          <Switch
                            checked={settings.showContactInfo}
                            onCheckedChange={(checked) => handleSettingChange("showContactInfo", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Allow Direct Messages</Label>
                            <p className="text-sm text-muted-foreground">Let others send you direct messages</p>
                          </div>
                          <Switch
                            checked={settings.allowDirectMessages}
                            onCheckedChange={(checked) => handleSettingChange("allowDirectMessages", checked)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle className="text-destructive">Danger Zone</CardTitle>
                      <CardDescription>Irreversible and destructive actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        This will permanently delete your account and all associated data.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="space-y-6">
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Display Preferences</CardTitle>
                      <CardDescription>Customize how the application looks and behaves</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Language</Label>
                          <Select
                            value={settings.language}
                            onValueChange={(value) => handleSettingChange("language", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="de">Deutsch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Timezone</Label>
                          <Select
                            value={settings.timezone}
                            onValueChange={(value) => handleSettingChange("timezone", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time</SelectItem>
                              <SelectItem value="America/Chicago">Central Time</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Items Per Page</Label>
                          <Select
                            value={settings.itemsPerPage}
                            onValueChange={(value) => handleSettingChange("itemsPerPage", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="6">6 items</SelectItem>
                              <SelectItem value="12">12 items</SelectItem>
                              <SelectItem value="24">24 items</SelectItem>
                              <SelectItem value="48">48 items</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Default View</Label>
                          <Select
                            value={settings.defaultView}
                            onValueChange={(value) => handleSettingChange("defaultView", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grid">Grid View</SelectItem>
                              <SelectItem value="list">List View</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
