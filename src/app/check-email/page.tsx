"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { PublicNavigation } from "@/components/public-navigation"
import { Mail, ArrowLeft, RefreshCw, CheckCircle, Clock } from "lucide-react"

function CheckEmailContent() {
  const [email, setEmail] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleResendEmail = async () => {
    if (!email) return
    
    setIsResending(true)
    setResendSuccess(false)
    setResendError("")
    
    try {
      const response = await fetch('/api/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResendSuccess(true)
        setTimeout(() => setResendSuccess(false), 5000)
      } else {
        // Show specific error message
        const errorMessage = data.error || 'Failed to resend email'
        setResendError(errorMessage)
        console.error('Resend email error:', errorMessage)
      }
    } catch (error) {
      console.error('Error resending email:', error)
      setResendError('Network error. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--green)]/8 via-[var(--peach)]/8 to-[var(--mauve)]/8"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Yz0wYjMiIGZpbGwtb3BhY2l0eT0iMC4wOCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[var(--green)]/15 to-[var(--peach)]/15 rounded-3xl mb-8 group hover:scale-110 transition-all duration-500 shadow-lg shadow-[var(--green)]/10">
              <Mail className="w-12 h-12 text-[var(--green)] group-hover:text-[var(--peach)] transition-colors duration-300" />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[var(--green)] via-[var(--peach)] to-[var(--mauve)] bg-clip-text text-transparent">
              Check Your Email
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-border shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-[var(--green)]/10 to-[var(--peach)]/10 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-[var(--green)]" />
                </div>
                <CardTitle className="text-2xl">Almost There!</CardTitle>
                <CardDescription className="text-base">
                  {email ? `We sent a verification email to ${email}` : 'We sent a verification email to your address'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[var(--green)] mt-0.5 flex-shrink-0" />
                    <p>Check your email inbox (and spam folder)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[var(--green)] mt-0.5 flex-shrink-0" />
                    <p>Click the verification link in the email</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[var(--green)] mt-0.5 flex-shrink-0" />
                    <p>Return here to sign in to your account</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={handleResendEmail}
                    disabled={isResending || !email}
                    className="w-full h-12 bg-gradient-to-r from-[var(--green)] to-[var(--peach)] hover:from-[var(--green)]/90 hover:to-[var(--peach)]/90 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>
                  
                  {resendSuccess && (
                    <div className="mt-3 p-3 bg-[var(--green)]/10 border border-[var(--green)]/20 rounded-lg text-center">
                      <p className="text-sm text-[var(--green)] font-medium">
                        ✅ Verification email sent successfully!
                      </p>
                    </div>
                  )}
                  
                  {resendError && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                      <p className="text-sm text-red-600 font-medium">
                        ❌ {resendError}
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <Link 
                    href="/login"
                    className="inline-flex items-center text-[var(--blue)] hover:text-[var(--blue)]/80 font-medium transition-colors duration-200"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  )
}
