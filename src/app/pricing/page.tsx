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
  Building2
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: { monthly: 0, annual: 0 },
      icon: CheckCircle,
      color: "green",
      features: [
        "Up to 5 invoices per month",
        "Basic invoice templates",
        "Client management (up to 10 clients)",
        "PDF generation",
        "Email support",
        "Mobile app access"
      ],
      limitations: [
        "Limited customization",
        "Basic reporting"
      ],
      cta: "Get Started Free",
      ctaVariant: "default" as const,
      popular: false
    },
    {
      name: "Pro",
      description: "For growing businesses",
      price: { monthly: 29, annual: 290 },
      icon: FileText,
      color: "blue",
      features: [
        "Unlimited invoices",
        "Advanced templates & branding",
        "Unlimited clients",
        "Payment tracking & reminders",
        "Analytics dashboard",
        "Priority support",
        "API access",
        "Custom fields",
        "Recurring invoices",
        "Multi-currency support"
      ],
      limitations: [],
      cta: "Start Pro Trial",
      ctaVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      price: { monthly: 99, annual: 990 },
      icon: Building2,
      color: "mauve",
      features: [
        "Everything in Pro",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee (99.9%)",
        "Advanced security features",
        "White-label options",
        "Custom reporting",
        "Team collaboration tools",
        "Advanced permissions",
        "Priority feature requests"
      ],
      limitations: [],
      cta: "Contact Sales",
      ctaVariant: "outline" as const,
      popular: false
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      green: {
        border: "border-l-[var(--green)]",
        bg: "bg-[var(--green)]/10",
        text: "text-[var(--green)]",
        button: "bg-[var(--green)] hover:bg-[var(--green)]/90"
      },
      blue: {
        border: "border-l-[var(--blue)]",
        bg: "bg-[var(--blue)]/10",
        text: "text-[var(--blue)]",
        button: "bg-[var(--blue)] hover:bg-[var(--blue)]/90"
      },
      mauve: {
        border: "border-l-[var(--mauve)]",
        bg: "bg-[var(--mauve)]/10",
        text: "text-[var(--mauve)]",
        button: "border-[var(--mauve)] text-[var(--mauve)] hover:bg-[var(--mauve)]/10"
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
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
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                  Features
                </Link>
                <Link href="/pricing" className="text-[var(--blue)] font-medium">
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
              <CreditCard className="h-12 w-12 text-[var(--blue)] group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-light text-foreground mb-8 group">
              <span className="bg-gradient-to-r from-[var(--blue)] via-[var(--mauve)] to-[var(--peach)] bg-clip-text text-transparent transition-all duration-700 drop-shadow-sm">
                Choose the plan that fits your business
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
              No hidden fees, no surprises. Start free and upgrade as you grow. 
              Cancel anytime with no questions asked.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-16">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--blue)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--blue)] focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="bg-[var(--green)]/10 text-[var(--green)] px-2 py-1 rounded-full text-xs font-medium">
                  Save 17%
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {plans.map((plan, index) => {
                const colorClasses = getColorClasses(plan.color)
                const Icon = plan.icon
                const price = isAnnual ? plan.price.annual : plan.price.monthly
                const savings = isAnnual && plan.price.annual > 0 ? Math.round((plan.price.monthly * 12 - plan.price.annual) / (plan.price.monthly * 12) * 100) : 0

                return (
                  <Card 
                    key={plan.name} 
                    className={`${colorClasses.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative ${
                      plan.popular ? 'ring-2 ring-[var(--blue)]/20' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-[var(--blue)] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>Most Popular</span>
                        </span>
                      </div>
                    )}
                    
                    <CardHeader className={`text-center pb-6 ${plan.popular ? 'pt-6' : 'pt-6'}`}>
                      <div className={`p-4 rounded-xl ${colorClasses.bg} w-fit mx-auto mb-4`}>
                        <Icon className={`h-8 w-8 ${colorClasses.text}`} />
                      </div>
                      <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                      <CardDescription className="text-base mb-6">{plan.description}</CardDescription>
                      <div className="min-h-[120px] flex flex-col justify-center">
                        <div className="flex items-baseline justify-center mb-2">
                          <span className="text-5xl font-bold text-foreground">
                            ${price}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            /{isAnnual ? 'year' : 'month'}
                          </span>
                        </div>
                        {isAnnual && plan.price.annual > 0 ? (
                          <p className="text-sm text-[var(--green)]">
                            Save ${plan.price.monthly * 12 - plan.price.annual}/year ({savings}% off)
                          </p>
                        ) : (
                          <div className="h-5"></div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 flex flex-col h-full">
                      <div className="space-y-3 flex-1">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-3">
                            <CheckCircle className={`h-5 w-5 ${colorClasses.text}`} />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {plan.limitations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Limitations:</h4>
                          <div className="space-y-1">
                            {plan.limitations.map((limitation, limitIndex) => (
                              <div key={limitIndex} className="flex items-center space-x-3">
                                <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{limitation}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-auto pt-4">
                        <Button 
                          asChild 
                          className={`w-full h-12 ${colorClasses.button}`}
                          variant={plan.ctaVariant}
                        >
                          <Link href={plan.name === "Enterprise" ? "/contact" : "/register"}>
                            {plan.cta}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about our pricing and plans.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Can I change plans anytime?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Is there a free trial?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! All paid plans come with a 14-day free trial. No credit card required to start.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, PayPal, and bank transfers for annual plans.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Can I cancel anytime?
                  </h3>
                  <p className="text-muted-foreground">
                    Absolutely. You can cancel your subscription at any time with no questions asked. You'll retain access until the end of your billing period.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Do you offer refunds?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Is my data secure?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, we use enterprise-grade security with 256-bit SSL encryption and regular security audits to protect your data.
                  </p>
                </div>
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
              Ready to get started?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of businesses already using Vibe Voicer to streamline their invoicing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[var(--blue)] hover:bg-[var(--blue)]/90 h-14 px-8 text-lg">
                <Link href="/register" className="flex items-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[var(--mauve)] text-[var(--mauve)] hover:bg-[var(--mauve)]/10 h-14 px-8 text-lg">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
