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
  TrendingUp
} from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
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
                <Link href="/features" className="text-[var(--blue)] font-medium">
                  Features
                </Link>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                  Pricing
                </Link>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
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
              <Zap className="h-12 w-12 text-[var(--blue)] group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-light text-foreground mb-8 group">
              <span className="bg-gradient-to-r from-[var(--blue)] via-[var(--mauve)] to-[var(--peach)] bg-clip-text text-transparent transition-all duration-700 drop-shadow-sm">
                Everything you need to manage invoices
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover the comprehensive suite of tools designed to streamline your invoicing workflow, 
              manage clients, and grow your business with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Core Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Essential tools that make invoice management effortless and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Invoice Creation */}
            <Card className="border-l-4 border-l-[var(--blue)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="p-4 rounded-xl bg-[var(--blue)]/10 w-fit mb-4">
                  <FileText className="h-8 w-8 text-[var(--blue)]" />
                </div>
                <CardTitle className="text-2xl">Invoice Creation</CardTitle>
                <CardDescription className="text-base">
                  Create professional invoices with customizable templates and branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[var(--blue)]" />
                    <span className="text-sm">Custom templates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[var(--blue)]" />
                    <span className="text-sm">Line items & taxes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[var(--blue)]" />
                    <span className="text-sm">PDF generation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[var(--blue)]" />
                    <span className="text-sm">Auto-numbering</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Management */}
            <Card className="border-l-4 border-l-[var(--green)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="p-4 rounded-xl bg-[var(--green)]/10 w-fit mb-4">
                  <Users className="h-8 w-8 text-[var(--green)]" />
                </div>
                <CardTitle className="text-2xl">Client Management</CardTitle>
                <CardDescription className="text-base">
                  Keep track of all your clients and their information in one place
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[var(--green)]" />
                    <span className="text-sm">Contact details</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[var(--green)]" />
                    <span className="text-sm">Invoice history</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[var(--green)]" />
                    <span className="text-sm">Payment tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[var(--green)]" />
                    <span className="text-sm">Notes & tags</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Tracking */}
            <Card className="border-l-4 border-l-[var(--peach)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="p-4 rounded-xl bg-[var(--peach)]/10 w-fit mb-4">
                  <DollarSign className="h-8 w-8 text-[var(--peach)]" />
                </div>
                <CardTitle className="text-2xl">Payment Tracking</CardTitle>
                <CardDescription className="text-base">
                  Monitor invoice status and payment history with real-time updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[var(--peach)]" />
                    <span className="text-sm">Status tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[var(--peach)]" />
                    <span className="text-sm">Payment reminders</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[var(--peach)]" />
                    <span className="text-sm">Revenue analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[var(--peach)]" />
                    <span className="text-sm">Overdue alerts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Advanced Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools to take your invoicing to the next level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Analytics */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="p-4 rounded-xl bg-[var(--sky)]/10 w-fit mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-[var(--sky)]" />
                </div>
                <CardTitle className="text-xl">Analytics</CardTitle>
                <CardDescription>
                  Detailed insights into your business performance
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Email Integration */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="p-4 rounded-xl bg-[var(--mauve)]/10 w-fit mx-auto mb-4">
                  <Mail className="h-8 w-8 text-[var(--mauve)]" />
                </div>
                <CardTitle className="text-xl">Email Integration</CardTitle>
                <CardDescription>
                  Send invoices directly from the platform
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Mobile App */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="p-4 rounded-xl bg-[var(--green)]/10 w-fit mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-[var(--green)]" />
                </div>
                <CardTitle className="text-xl">Mobile App</CardTitle>
                <CardDescription>
                  Manage invoices on the go
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Security */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="p-4 rounded-xl bg-[var(--red)]/10 w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-[var(--red)]" />
                </div>
                <CardTitle className="text-xl">Security</CardTitle>
                <CardDescription>
                  Enterprise-grade security and encryption
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Streamlined Workflow
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how Vibe Voicer simplifies your entire invoicing process.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="p-6 rounded-full bg-[var(--blue)]/10 w-fit mx-auto mb-6">
                  <span className="text-2xl font-bold text-[var(--blue)]">1</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Create Invoice</h3>
                <p className="text-muted-foreground">
                  Choose a template, add line items, and customize your invoice with your branding.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="p-6 rounded-full bg-[var(--green)]/10 w-fit mx-auto mb-6">
                  <span className="text-2xl font-bold text-[var(--green)]">2</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Send to Client</h3>
                <p className="text-muted-foreground">
                  Send your invoice via email or share a secure link with your client.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="p-6 rounded-full bg-[var(--peach)]/10 w-fit mx-auto mb-6">
                  <span className="text-2xl font-bold text-[var(--peach)]">3</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Get Paid</h3>
                <p className="text-muted-foreground">
                  Track payment status and receive notifications when your invoice is paid.
                </p>
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
              Ready to experience these features?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Start your free trial today and discover how Vibe Voicer can transform your invoicing workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[var(--blue)] hover:bg-[var(--blue)]/90 h-14 px-8 text-lg">
                <Link href="/register" className="flex items-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[var(--mauve)] text-[var(--mauve)] hover:bg-[var(--mauve)]/10 h-14 px-8 text-lg">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
