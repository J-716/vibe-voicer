"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signUp, signIn } from "@/lib/auth-client"
import { toast } from "sonner"
import { ThemeSelector } from "@/components/theme-selector"
import { Footer } from "@/components/footer"
import { PublicNavigation } from "@/components/public-navigation"
import { getEnabledOAuthProviders } from "@/lib/oauth-config"
import { FileText, Users, DollarSign, CheckCircle, ArrowRight, Mail, Lock, User, Sparkles, UserPlus } from "lucide-react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthSignUp, setIsOAuthSignUp] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // For email sign-up, name is required
      if (!isOAuthSignUp && !name.trim()) {
        toast.error("Please enter your full name")
        return
      }

      const { data, error } = await signUp.email({
        email,
        password,
        name: isOAuthSignUp ? "" : name, // Only send name for email sign-ups
      })
      if (error) {
        console.error("Sign up error:", error)
        throw error
      }
      toast.success("Account created successfully!")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Auth error:", error)
      toast.error(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignUp = async (provider: "google" | "github") => {
    setIsLoading(true)
    setIsOAuthSignUp(true)
    try {
      // Use signIn.social for OAuth providers as they handle both login and sign-up
      const { data, error } = await signIn.social({
        provider,
        callbackURL: "/dashboard",
      })
      if (error) {
        console.error(`${provider} signup error:`, error)
        throw error
      }
      // Success - user will be redirected automatically
      toast.success(`Account created with ${provider} successfully!`)
    } catch (error: any) {
      console.error(`${provider} auth error:`, error)
      const errorMessage = error.message || `Failed to create account with ${provider}. Please try again.`
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
      setIsOAuthSignUp(false)
    }
  }

  // Reset OAuth state when user starts typing in email field
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (isOAuthSignUp) {
      setIsOAuthSignUp(false)
    }
  }

  // Get enabled OAuth providers
  const oauthProviders = getEnabledOAuthProviders()
  const hasOAuthProviders = oauthProviders.length > 0

  return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--green)]/8 via-[var(--peach)]/8 to-[var(--mauve)]/8"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InZhcig--bWF1dmUpIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[var(--green)]/15 to-[var(--peach)]/15 rounded-3xl mb-8 group hover:scale-110 transition-all duration-500 shadow-lg shadow-[var(--green)]/10">
              <UserPlus className="h-12 w-12 text-[var(--green)] group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-light text-foreground mb-8 group">
              <span className="bg-gradient-to-r from-[var(--green)] via-[var(--peach)] to-[var(--mauve)] bg-clip-text text-transparent transition-all duration-700 drop-shadow-sm">
                Join thousands of businesses
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create professional invoices, manage clients, and track payments with our all-in-one platform. 
              Start your free trial today.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-l-4 border-l-[var(--green)] shadow-lg">
              <CardHeader className="space-y-1 text-center">
                <div className="p-3 rounded-lg bg-[var(--green)]/10 w-fit mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-[var(--green)]" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Create your account
                </CardTitle>
                <CardDescription>
                  Get started with Vibe Voicer in just a few steps
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isOAuthSignUp && (
                  <div className="mb-4 p-3 bg-[var(--blue)]/10 border border-[var(--blue)]/20 rounded-lg">
                    <p className="text-sm text-[var(--blue)] text-center">
                      <Sparkles className="h-4 w-4 inline mr-2" />
                      OAuth sign-up in progress... Your name will be provided automatically.
                    </p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isOAuthSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-foreground">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          className="pl-10 h-12 border-2 border-border hover:border-[var(--green)]/50 focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20 transition-all duration-200 text-base"
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        className="pl-10 h-12 border-2 border-border hover:border-[var(--green)]/50 focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20 transition-all duration-200 text-base"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        className="pl-10 h-12 border-2 border-border hover:border-[var(--green)]/50 focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20 transition-all duration-200 text-base"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-[var(--green)] to-[var(--green)]/90 hover:from-[var(--green)]/90 hover:to-[var(--green)]/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Create account</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>

                {hasOAuthProviders && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-3 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <div className={`grid gap-3 ${oauthProviders.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {oauthProviders.map((provider) => (
                        <Button
                          key={provider.id}
                          variant="outline"
                          onClick={() => handleSocialSignUp(provider.id)}
                          disabled={isLoading}
                          className={`h-12 border-2 border-border transition-all duration-300 shadow-sm hover:shadow-md ${
                            provider.id === 'google' 
                              ? 'hover:border-[var(--red)]/50 hover:text-[var(--red)] hover:bg-gradient-to-r hover:from-[var(--red)]/10 hover:to-[var(--red)]/5'
                              : 'hover:border-[var(--mauve)]/50 hover:text-[var(--mauve)] hover:bg-gradient-to-r hover:from-[var(--mauve)]/10 hover:to-[var(--mauve)]/5'
                          }`}
                        >
                          {provider.name}
                        </Button>
                      ))}
                    </div>
                  </>
                )}

                <div className="text-center text-sm mt-6">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <Link 
                    href="/login" 
                    className="text-[var(--blue)] hover:text-[var(--blue)]/80 font-medium"
                  >
                    Sign in instead
                  </Link>
                </div>

                {/* Terms */}
                <div className="text-xs text-muted-foreground text-center mt-4">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-[var(--blue)] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[var(--blue)] hover:underline">
                    Privacy Policy
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why choose Vibe Voicer?
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to manage your invoicing professionally
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="p-4 rounded-xl bg-[var(--blue)]/10 w-fit mx-auto mb-4">
                  <FileText className="h-8 w-8 text-[var(--blue)]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Professional Invoices</h3>
                <p className="text-muted-foreground text-sm">Create stunning invoices in minutes with our templates</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 rounded-xl bg-[var(--green)]/10 w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-[var(--green)]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Client Management</h3>
                <p className="text-muted-foreground text-sm">Keep track of all your clients and their information</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 rounded-xl bg-[var(--peach)]/10 w-fit mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-[var(--peach)]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Payment Tracking</h3>
                <p className="text-muted-foreground text-sm">Monitor invoice status and get paid faster</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 rounded-xl bg-[var(--mauve)]/10 w-fit mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-[var(--mauve)]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Free Forever</h3>
                <p className="text-muted-foreground text-sm">Start with our free plan, upgrade when you're ready</p>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="p-6 rounded-xl bg-[var(--sky)]/5 border border-[var(--sky)]/20 text-center">
                <p className="text-lg text-muted-foreground italic mb-4">
                  "Vibe Voicer has transformed how we handle invoicing. It's saved us hours every week and helped us get paid faster!"
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--sky)]/20 flex items-center justify-center">
                    <span className="text-[var(--sky)] font-semibold">SJ</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Sarah Johnson</p>
                    <p className="text-sm text-[var(--sky)]">Freelance Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
