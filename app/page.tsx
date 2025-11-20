"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Users, MapPin, ArrowRight, Package, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { label: "Items Reunited", value: "1,247", icon: CheckCircle, color: "text-green-600" },
    { label: "Active Listings", value: "89", icon: Clock, color: "text-accent" },
    { label: "Campus Locations", value: "15", icon: MapPin, color: "text-primary" },
    { label: "Happy Students", value: "892", icon: Users, color: "text-accent" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`space-y-8 ${isVisible ? "animate-slide-in" : "opacity-0"}`}>
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  College <span className="text-primary">Lost & Found</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Reuniting students with their belongings through our smart campus community platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="bg-transparent">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Feature Cards */}
            <div
              className={`space-y-6 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              style={{ animationDelay: "0.2s" }}
            >
              <div className="grid gap-4">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/20 p-3 rounded-lg">
                        <Search className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Smart Search</h3>
                        <p className="text-sm text-muted-foreground">AI-powered item matching</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-accent/20 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Community Driven</h3>
                        <p className="text-sm text-muted-foreground">Students helping students</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/20 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Campus Wide</h3>
                        <p className="text-sm text-muted-foreground">All buildings covered</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div
          className="absolute top-20 right-20 w-20 h-20 bg-primary/10 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-20 w-16 h-16 bg-accent/10 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        />
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Making a Difference</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform has helped thousands of students reconnect with their lost belongings
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                className={`text-center transform hover:scale-105 transition-all duration-300 ${
                  isVisible ? "animate-scale-in" : "opacity-0"
                }`}
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <stat.icon className={`h-8 w-8 mx-auto mb-4 ${stat.color}`} />
                  <div className="text-2xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Ready to Get Started?</CardTitle>
              <CardDescription className="text-muted-foreground">
                Join our community and help make campus a better place for everyone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Package className="mr-2 h-4 w-4" />
                    Browse Items
                  </Button>
                </Link>
                <Link href="/report">
                  <Button size="lg" variant="outline" className="bg-transparent">
                    Report Lost Item
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
