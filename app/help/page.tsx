"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MessageCircle,
  Book,
  Phone,
  Mail,
  HelpCircle,
  ChevronRight,
  Send,
  ExternalLink,
  Clock,
  Users,
  Shield,
} from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { EnhancedThemeToggle } from "@/components/enhanced-theme-toggle"

const faqs = [
  {
    id: "1",
    category: "Getting Started",
    question: "How do I report a lost item?",
    answer:
      "To report a lost item, click on 'Report Item' in the sidebar or dashboard. Fill out the form with detailed information about your lost item, including description, location, and date. The more details you provide, the better chance someone can help you find it.",
  },
  {
    id: "2",
    category: "Getting Started",
    question: "How do I report a found item?",
    answer:
      "When reporting an item, select 'Found Item' instead of 'Lost Item'. Provide as much detail as possible about the item and where you found it. This helps the original owner identify their belongings.",
  },
  {
    id: "3",
    category: "Search & Matching",
    question: "How does the matching system work?",
    answer:
      "Our system automatically compares lost and found item descriptions, categories, locations, and dates to suggest potential matches. You'll receive notifications when possible matches are found.",
  },
  {
    id: "4",
    category: "Search & Matching",
    question: "Can I search for specific items?",
    answer:
      "Yes! Use the Search Items page to look for specific items. You can filter by category, location, date range, and status. Save your searches to get notified when matching items are reported.",
  },
  {
    id: "5",
    category: "Privacy & Safety",
    question: "Is my contact information safe?",
    answer:
      "We take privacy seriously. Your contact information is only shared with verified users when there's a potential match. You can control your privacy settings in the Settings page.",
  },
  {
    id: "6",
    category: "Privacy & Safety",
    question: "How do I verify someone claiming my item?",
    answer:
      "Always meet in a public, well-lit area on campus. Ask the person to describe specific details about the item that weren't mentioned in your report. Contact campus security if you have any concerns.",
  },
  {
    id: "7",
    category: "Account & Settings",
    question: "How do I change my notification preferences?",
    answer:
      "Go to Settings > Notifications to customize how and when you receive notifications. You can enable/disable email, push, and SMS notifications based on your preferences.",
  },
  {
    id: "8",
    category: "Account & Settings",
    question: "Can I delete my account?",
    answer:
      "Yes, you can delete your account from Settings > Privacy > Danger Zone. Note that this action is irreversible and will permanently delete all your data.",
  },
]

const quickLinks = [
  { title: "Report Lost Item", href: "/report", icon: HelpCircle },
  { title: "Search Items", href: "/search", icon: Search },
  { title: "Notification Settings", href: "/settings", icon: MessageCircle },
  { title: "Privacy Settings", href: "/settings", icon: Shield },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    email: "",
  })

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const categories = [...new Set(faqs.map((faq) => faq.category))]

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle contact form submission
    console.log("Contact form submitted:", contactForm)
    // Reset form
    setContactForm({ subject: "", message: "", email: "" })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />

        <div className="flex-1 lg:ml-64">
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="animate-slide-in">
                <h1 className="text-2xl font-bold text-card-foreground">Help & Support</h1>
                <p className="text-muted-foreground">Find answers and get assistance</p>
              </div>
              <EnhancedThemeToggle />
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Quick Actions */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and helpful links</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickLinks.map((link) => (
                    <Button
                      key={link.title}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent hover:bg-accent/50"
                      onClick={() => (window.location.href = link.href)}
                    >
                      <link.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{link.title}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* FAQ Section */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Find answers to common questions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Search FAQs */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={searchQuery === "" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSearchQuery("")}
                      >
                        All
                      </Badge>
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => setSearchQuery(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>

                    {/* FAQ Accordion */}
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-start space-x-2">
                              <Badge variant="secondary" className="text-xs">
                                {faq.category}
                              </Badge>
                              <span>{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    {filteredFaqs.length === 0 && (
                      <div className="text-center py-8">
                        <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No FAQs found</h3>
                        <p className="text-muted-foreground">Try adjusting your search terms</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact & Resources */}
              <div className="space-y-6">
                {/* Contact Support */}
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                    <CardDescription>Still need help? Get in touch</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="contact" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                        <TabsTrigger value="info">Info</TabsTrigger>
                      </TabsList>

                      <TabsContent value="contact" className="space-y-4 mt-4">
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Input
                              placeholder="Subject"
                              value={contactForm.subject}
                              onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Input
                              type="email"
                              placeholder="Your email"
                              value={contactForm.email}
                              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Describe your issue..."
                              value={contactForm.message}
                              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                              rows={4}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </Button>
                        </form>
                      </TabsContent>

                      <TabsContent value="info" className="space-y-4 mt-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/20">
                            <Mail className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">Email</p>
                              <p className="text-sm text-muted-foreground">support@college.edu</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/20">
                            <Phone className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">Phone</p>
                              <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent/20">
                            <Clock className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">Hours</p>
                              <p className="text-sm text-muted-foreground">Mon-Fri 9AM-5PM</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Resources */}
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Resources</CardTitle>
                    <CardDescription>Additional help and information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      <div className="flex items-center space-x-2">
                        <Book className="h-4 w-4" />
                        <span>User Guide</span>
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Community Forum</span>
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>Live Chat</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Online
                      </Badge>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
