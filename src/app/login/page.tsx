"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "@/lib/auth-client"
import { toast } from "sonner"
import { ThemeSelector } from "@/components/theme-selector"
import { Footer } from "@/components/footer"
import { PublicNavigation } from "@/components/public-navigation"
import { FileText, Users, DollarSign, CheckCircle, ArrowRight, Mail, Lock, Sparkles, LogIn } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await signIn.email({
        email,
        password,
      })
      if (error) {
        console.error("Sign in error:", error)
        throw error
      }
      toast.success("Signed in successfully!")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Auth error:", error)
      toast.error(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "github") => {
    setIsLoading(true)
    try {
      const { data, error } = await signIn.social({
        provider,
        callbackURL: "/dashboard",
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Check if social providers are configured
  // For client-side, we need to check if the buttons should be shown
  // Since we can't access server env vars on client, we'll show them by default
  // and let the server handle the actual OAuth configuration
  const hasGoogle = true // Show Google button - server will handle if not configured
  const hasGithub = true // Show GitHub button - server will handle if not configured

  return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--blue)]/8 via-[var(--mauve)]/8 to-[var(--peach)]/8"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InZhcig--bWF1dmUpIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[var(--blue)]/15 to-[var(--mauve)]/15 rounded-3xl mb-8 group hover:scale-110 transition-all duration-500 shadow-lg shadow-[var(--blue)]/10">
              <LogIn className="h-12 w-12 text-[var(--blue)] group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-light text-foreground mb-8 group">
              <span className="bg-gradient-to-r from-[var(--blue)] via-[var(--mauve)] to-[var(--peach)] bg-clip-text text-transparent transition-all duration-700 drop-shadow-sm">
                Sign in to Vibe Voicer
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Access your dashboard and continue growing your business with professional invoice management.
            </p>
          </div>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-l-4 border-l-[var(--blue)] shadow-lg">
              <CardHeader className="space-y-1 text-center">
                <div className="p-3 rounded-lg bg-[var(--blue)]/10 w-fit mx-auto mb-4">
                  <FileText className="h-8 w-8 text-[var(--blue)]" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Sign in to your account
                </CardTitle>
                <CardDescription>
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 h-12 border-2 border-border hover:border-[var(--blue)]/50 focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/20 transition-all duration-200 text-base"
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 h-12 border-2 border-border hover:border-[var(--blue)]/50 focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/20 transition-all duration-200 text-base"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-[var(--blue)] to-[var(--blue)]/90 hover:from-[var(--blue)]/90 hover:to-[var(--blue)]/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Sign in</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>

                {(hasGoogle || hasGithub) && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-3 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {hasGoogle && (
                        <Button
                          variant="outline"
                          onClick={() => handleSocialLogin("google")}
                          disabled={isLoading}
                          className="h-12 border-2 border-border hover:border-[var(--red)]/50 hover:text-[var(--red)] hover:bg-gradient-to-r hover:from-[var(--red)]/10 hover:to-[var(--red)]/5 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          Google
                        </Button>
                      )}
                      {hasGithub && (
                        <Button
                          variant="outline"
                          onClick={() => handleSocialLogin("github")}
                          disabled={isLoading}
                          className="h-12 border-2 border-border hover:border-[var(--mauve)]/50 hover:text-[var(--mauve)] hover:bg-gradient-to-r hover:from-[var(--mauve)]/10 hover:to-[var(--mauve)]/5 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          GitHub
                        </Button>
                      )}
                    </div>
                  </>
                )}

                <div className="text-center text-sm mt-6">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link 
                    href="/register" 
                    className="text-[var(--blue)] hover:text-[var(--blue)]/80 font-medium"
                  >
                    Sign up for free
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why choose Vibe Voicer?
              </h2>
              <p className="text-lg text-muted-foreground">
                Professional invoice management made simple
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="p-4 rounded-xl bg-[var(--blue)]/10 w-fit mx-auto mb-4">
                  <FileText className="h-8 w-8 text-[var(--blue)]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Create Invoices</h3>
                <p className="text-muted-foreground text-sm">Professional templates and easy customization</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 rounded-xl bg-[var(--green)]/10 w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-[var(--green)]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Manage Clients</h3>
                <p className="text-muted-foreground text-sm">Keep track of all your client information</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 rounded-xl bg-[var(--peach)]/10 w-fit mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-[var(--peach)]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Track Payments</h3>
                <p className="text-muted-foreground text-sm">Monitor invoice status and revenue</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 rounded-xl bg-[var(--mauve)]/10 w-fit mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-[var(--mauve)]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Streamline Workflow</h3>
                <p className="text-muted-foreground text-sm">Automate your invoicing process</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}