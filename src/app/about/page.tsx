"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeSelector } from "@/components/theme-selector"
import { Footer } from "@/components/footer"
import { 
  FileText, 
  Users, 
  DollarSign, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Clock,
  Shield,
  BarChart3,
  Mail,
  Download,
  Settings,
  Zap,
  Globe,
  Smartphone,
  CreditCard,
  Bell,
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  Star,
  Crown,
  Building2,
  Heart,
  Target,
  Award,
  Lightbulb,
  Rocket,
  Handshake,
  Globe2,
  MessageCircle
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "👩‍💼",
      description: "Former finance executive with 10+ years in fintech"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "👨‍💻",
      description: "Full-stack engineer passionate about user experience"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      image: "👩‍🎨",
      description: "UI/UX designer focused on creating intuitive interfaces"
    },
    {
      name: "David Kim",
      role: "Head of Customer Success",
      image: "👨‍💼",
      description: "Customer advocate with a background in SaaS"
    }
  ]

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make is guided by what's best for our customers and their success."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We constantly push the boundaries of what's possible in invoice management."
    },
    {
      icon: Shield,
      title: "Security",
      description: "Your data security and privacy are our top priorities, always."
    },
    {
      icon: Handshake,
      title: "Transparency",
      description: "We believe in honest communication and transparent business practices."
    }
  ]

  const stats = [
    { number: "10,000+", label: "Active Users", icon: Users },
    { number: "$2M+", label: "Invoices Processed", icon: DollarSign },
    { number: "99.9%", label: "Uptime", icon: Shield },
    { number: "50+", label: "Countries", icon: Globe2 }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--blue)]/10 to-[var(--mauve)]/10 group-hover:from-[var(--blue)]/20 group-hover:to-[var(--mauve)]/20 transition-all duration-300">
                <FileText className="h-6 w-6 text-[var(--blue)]" />
              </div>
              <div>
                <span className="text-2xl font-bold text-foreground group-hover:text-[var(--blue)] transition-colors duration-300">
                  Vibe Voicer
                </span>
                <p className="text-xs text-muted-foreground -mt-1">Invoice Management</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                  Features
                </Link>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                  Pricing
                </Link>
                <Link href="/about" className="text-[var(--blue)] font-medium">
                  About
                </Link>
              </nav>
              
              <div className="flex items-center space-x-3">
                <ThemeSelector />
                <div className="hidden sm:block w-px h-6 bg-border"></div>
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-[var(--mauve)]/10">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-[var(--blue)] to-[var(--mauve)] hover:from-[var(--blue)]/90 hover:to-[var(--mauve)]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/register" className="flex items-center space-x-2">
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--blue)]/8 via-[var(--mauve)]/8 to-[var(--peach)]/8"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InZhcig--bWF1dmUpIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[var(--blue)]/15 to-[var(--mauve)]/15 rounded-3xl mb-8 group hover:scale-110 transition-all duration-500 shadow-lg shadow-[var(--blue)]/10">
              <Heart className="h-12 w-12 text-[var(--blue)] group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-light text-foreground mb-8 group">
              <span className="bg-gradient-to-r from-[var(--blue)] via-[var(--mauve)] to-[var(--peach)] bg-clip-text text-transparent transition-all duration-700 drop-shadow-sm">
                We're on a mission to simplify invoicing
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Founded in 2024, Vibe Voicer was born from a simple idea: invoicing shouldn't be complicated. 
              We're building the tools that help businesses focus on what they do best.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="p-4 rounded-xl bg-[var(--blue)]/10 w-fit mx-auto mb-4">
                      <Icon className="h-8 w-8 text-[var(--blue)]" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  We believe that every business, no matter how small, deserves access to professional 
                  invoicing tools that help them get paid faster and grow with confidence.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Our platform combines powerful features with an intuitive interface, making it easy 
                  for anyone to create, send, and track invoices without the complexity of traditional 
                  accounting software.
                </p>
                <div className="flex items-center space-x-4">
                  <Button asChild className="bg-[var(--blue)] hover:bg-[var(--blue)]/90">
                    <Link href="/register">Join Our Mission</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-[var(--mauve)] text-[var(--mauve)] hover:bg-[var(--mauve)]/10">
                    <Link href="/contact">Get in Touch</Link>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 text-center">
                  <Target className="h-8 w-8 text-[var(--blue)] mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Focus</h3>
                  <p className="text-sm text-muted-foreground">We focus on one thing: making invoicing simple</p>
                </Card>
                <Card className="p-6 text-center">
                  <Rocket className="h-8 w-8 text-[var(--green)] mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Innovation</h3>
                  <p className="text-sm text-muted-foreground">Constantly improving based on user feedback</p>
                </Card>
                <Card className="p-6 text-center">
                  <Heart className="h-8 w-8 text-[var(--peach)] mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Care</h3>
                  <p className="text-sm text-muted-foreground">We genuinely care about our customers' success</p>
                </Card>
                <Card className="p-6 text-center">
                  <Award className="h-8 w-8 text-[var(--mauve)] mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Quality</h3>
                  <p className="text-sm text-muted-foreground">High-quality tools that businesses can rely on</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at Vibe Voicer.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="p-4 rounded-xl bg-[var(--blue)]/10 w-fit mx-auto mb-4">
                        <Icon className="h-8 w-8 text-[var(--blue)]" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {value.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Vibe Voicer, working every day to make your invoicing better.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="text-6xl mb-4">{member.image}</div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-[var(--blue)] font-medium">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Our Story
              </h2>
              <p className="text-xl text-muted-foreground">
                How Vibe Voicer came to be and where we're headed.
              </p>
            </div>

            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-4">The Problem</h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    Our founder, Sarah, was running a small consulting business and struggling with invoicing. 
                    Existing tools were either too complex, too expensive, or lacked the features she needed.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    She spent hours every week creating invoices, tracking payments, and following up with clients. 
                    There had to be a better way.
                  </p>
                </div>
                <div className="flex-1">
                  <div className="p-8 rounded-xl bg-[var(--red)]/10">
                    <div className="text-6xl mb-4">😤</div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Frustration</h4>
                    <p className="text-muted-foreground">Complex tools, hidden costs, poor support</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 order-2 md:order-1">
                  <div className="p-8 rounded-xl bg-[var(--blue)]/10">
                    <div className="text-6xl mb-4">💡</div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">The Solution</h4>
                    <p className="text-muted-foreground">Simple, powerful, affordable invoicing</p>
                  </div>
                </div>
                <div className="flex-1 order-1 md:order-2">
                  <h3 className="text-2xl font-bold text-foreground mb-4">The Solution</h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    So we built Vibe Voicer - a platform that combines the power of enterprise tools 
                    with the simplicity that small businesses need.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Clean design, powerful features, transparent pricing, and real human support. 
                    Everything you need, nothing you don't.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-4">The Future</h3>
                  <p className="text-lg text-muted-foreground mb-4">
                    Today, thousands of businesses trust Vibe Voicer to manage their invoicing. 
                    But we're just getting started.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    We're constantly adding new features, improving our platform, and listening to 
                    our customers to make invoicing even better.
                  </p>
                </div>
                <div className="flex-1">
                  <div className="p-8 rounded-xl bg-[var(--green)]/10">
                    <div className="text-6xl mb-4">🚀</div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Growth</h4>
                    <p className="text-muted-foreground">10,000+ users and growing every day</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to join our story?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Be part of the growing community of businesses that have simplified their invoicing with Vibe Voicer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[var(--blue)] hover:bg-[var(--blue)]/90 h-14 px-8 text-lg">
                <Link href="/register" className="flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[var(--mauve)] text-[var(--mauve)] hover:bg-[var(--mauve)]/10 h-14 px-8 text-lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
