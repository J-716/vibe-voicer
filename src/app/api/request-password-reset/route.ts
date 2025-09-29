import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, redirectTo } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Use Better Auth's requestPasswordReset function
    const data = await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: redirectTo || `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/reset-password`
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: "Password reset email sent" 
    })
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json(
      { error: "Failed to send password reset email" },
      { status: 500 }
    )
  }
}
