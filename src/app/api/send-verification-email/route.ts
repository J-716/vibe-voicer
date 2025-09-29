import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, callbackURL } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if email service is configured
    if (!process.env.RESEND_API_KEY || !process.env.SMTP_FROM) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      )
    }

    // Use Better Auth's sendVerificationEmail function
    const data = await auth.api.sendVerificationEmail({
      body: {
        email,
        callbackURL: callbackURL || `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/verify-email`
      }
    })

    console.log('Verification email sent successfully to:', email)

    return NextResponse.json({ 
      success: true, 
      message: "Verification email sent successfully" 
    })
  } catch (error) {
    console.error("Send verification email error:", error)
    
    // Provide more specific error messages
    let errorMessage = "Failed to send verification email"
    if (error instanceof Error) {
      if (error.message.includes('Invalid `from` field')) {
        errorMessage = "Email service configuration error"
      } else if (error.message.includes('API key')) {
        errorMessage = "Email service not properly configured"
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
