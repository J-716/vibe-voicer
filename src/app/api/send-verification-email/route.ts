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

    // Use Better Auth's sendVerificationEmail function
    const data = await auth.api.sendVerificationEmail({
      body: {
        email,
        callbackURL: callbackURL || `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/verify-email`
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: "Verification email sent" 
    })
  } catch (error) {
    console.error("Send verification email error:", error)
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    )
  }
}
