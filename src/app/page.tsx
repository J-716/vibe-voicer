"use client"

import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, DollarSign, CheckCircle, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { ThemeSelector } from "@/components/theme-selector"
import { Footer } from "@/components/footer"

export default function Home() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && session) {
      router.push("/dashboard")
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (session) {
    return null // Will redirect to dashboard
  }

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
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
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
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--blue)]/5 via-[var(--mauve)]/5 to-[var(--peach)]/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-[var(--blue)]/10 text-[var(--blue)] px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              <span>Trusted by 10,000+ businesses</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Professional
              <span className="bg-gradient-to-r from-[var(--blue)] to-[var(--mauve)] bg-clip-text text-transparent"> Invoice Management</span>
              <br />Made Simple
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Create, send, and track invoices with ease. Manage your clients, 
              streamline payments, and grow your business with our all-in-one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="bg-[var(--blue)] hover:bg-[var(--blue)]/90 h-14 px-8 text-lg">
                <Link href="/register" className="flex items-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[var(--mauve)] text-[var(--mauve)] hover:bg-[var(--mauve)]/10 h-14 px-8 text-lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--blue)] mb-2">10K+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--green)] mb-2">$2M+</div>
                <div className="text-muted-foreground">Invoices Processed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--peach)] mb-2">99.9%</div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything you need to manage invoices
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to streamline your invoicing workflow and help you get paid faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-l-4 border-l-[var(--blue)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="p-4 rounded-xl bg-[var(--blue)]/10 w-fit mx-auto mb-4">
                  <FileText className="h-8 w-8 text-[var(--blue)]" />
                </div>
                <CardTitle className="text-xl">Create Invoices</CardTitle>
                <CardDescription className="text-base">
                  Build professional invoices with customizable templates, line items, and branding
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-[var(--green)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="p-4 rounded-xl bg-[var(--green)]/10 w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-[var(--green)]" />
                </div>
                <CardTitle className="text-xl">Manage Clients</CardTitle>
                <CardDescription className="text-base">
                  Keep track of all your clients with detailed contact information and history
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-[var(--peach)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="p-4 rounded-xl bg-[var(--peach)]/10 w-fit mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-[var(--peach)]" />
                </div>
                <CardTitle className="text-xl">Track Payments</CardTitle>
                <CardDescription className="text-base">
                  Monitor invoice status, payment history, and revenue analytics in real-time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-[var(--mauve)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="p-4 rounded-xl bg-[var(--mauve)]/10 w-fit mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-[var(--mauve)]" />
                </div>
                <CardTitle className="text-xl">Easy Management</CardTitle>
                <CardDescription className="text-base">
                  Intuitive dashboard to manage all aspects of your business efficiently
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your business needs. No hidden fees, no surprises.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Free Plan */}
              <Card className="border-l-4 border-l-[var(--green)] hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center pb-6 pt-6">
                  <div className="p-3 rounded-lg bg-[var(--green)]/10 w-fit mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-[var(--green)]" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Free</CardTitle>
                  <CardDescription className="text-base mb-6">Perfect for getting started</CardDescription>
                  <div className="min-h-[80px] flex flex-col justify-center">
                    <div className="text-4xl font-bold text-foreground">$0<span className="text-lg text-muted-foreground">/month</span></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex flex-col h-full">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-[var(--green)]" />
                      <span className="text-sm">Up to 5 invoices/month</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-[var(--green)]" />
                      <span className="text-sm">Basic templates</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-[var(--green)]" />
                      <span className="text-sm">Email support</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <Button asChild className="w-full bg-[var(--green)] hover:bg-[var(--green)]/90">
                      <Link href="/register">Get Started Free</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="border-l-4 border-l-[var(--blue)] hover:shadow-lg transition-all duration-300 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[var(--blue)] text-white px-3 py-1 rounded-full text-xs font-medium">Most Popular</span>
                </div>
                <CardHeader className="text-center pb-6 pt-6">
                  <div className="p-3 rounded-lg bg-[var(--blue)]/10 w-fit mx-auto mb-4">
                    <FileText className="h-6 w-6 text-[var(--blue)]" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Pro</CardTitle>
                  <CardDescription className="text-base mb-6">For growing businesses</CardDescription>
                  <div className="min-h-[80px] flex flex-col justify-center">
                    <div className="text-4xl font-bold text-foreground">$29<span className="text-lg text-muted-foreground">/month</span></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex flex-col h-full">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-[var(--blue)]" />
                      <span className="text-sm">Unlimited invoices</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-[var(--blue)]" />
                      <span className="text-sm">Advanced templates</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-[var(--blue)]" />
                      <span className="text-sm">Priority support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-[var(--blue)]" />
                      <span className="text-sm">Analytics dashboard</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <Button asChild className="w-full bg-[var(--blue)] hover:bg-[var(--blue)]/90">
                      <Link href="/register">Start Pro Trial</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="border-l-4 border-l-[var(--mauve)] hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center pb-6 pt-6">
                  <div className="p-3 rounded-lg bg-[var(--mauve)]/10 w-fit mx-auto mb-4">
                    <Users className="h-6 w-6 text-[var(--mauve)]" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Enterprise</CardTitle>
                  <CardDescription className="text-base mb-6">For large organizations</CardDescription>
                  <div className="min-h-[80px] flex flex-col justify-center">
                    <div className="text-4xl font-bold text-foreground">Custom</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex flex-col h-full">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-[var(--mauve)]" />
                      <span className="text-sm">Everything in Pro</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-[var(--mauve)]" />
                      <span className="text-sm">Custom integrations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-[var(--mauve)]" />
                      <span className="text-sm">Dedicated support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-[var(--mauve)]" />
                      <span className="text-sm">SLA guarantee</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <Button asChild variant="outline" className="w-full border-[var(--mauve)] text-[var(--mauve)] hover:bg-[var(--mauve)]/10">
                      <Link href="/contact">Contact Sales</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Why choose Vibe Voicer?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              We're on a mission to simplify invoice management for businesses of all sizes. 
              Our platform combines powerful features with an intuitive interface to help you get paid faster.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="p-4 rounded-xl bg-[var(--blue)]/10 w-fit mx-auto mb-4">
                  <FileText className="h-8 w-8 text-[var(--blue)]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Easy to Use</h3>
                <p className="text-muted-foreground text-sm">Intuitive interface that anyone can master in minutes</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 rounded-xl bg-[var(--green)]/10 w-fit mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-[var(--green)]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Reliable</h3>
                <p className="text-muted-foreground text-sm">99.9% uptime with enterprise-grade security</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 rounded-xl bg-[var(--peach)]/10 w-fit mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-[var(--peach)]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Cost Effective</h3>
                <p className="text-muted-foreground text-sm">Transparent pricing with no hidden fees</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 rounded-xl bg-[var(--mauve)]/10 w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-[var(--mauve)]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Support</h3>
                <p className="text-muted-foreground text-sm">Dedicated support team ready to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to streamline your invoicing?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of businesses already using Vibe Voicer to manage their invoices and grow their revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[var(--sky)] hover:bg-[var(--sky)]/90 h-14 px-8 text-lg">
                <Link href="/register" className="flex items-center space-x-2">
                  <span>Start Your Free Trial</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[var(--green)] text-[var(--green)] hover:bg-[var(--green)]/10 h-14 px-8 text-lg">
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
