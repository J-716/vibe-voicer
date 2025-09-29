import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { newPassword, token } = await request.json()

    if (!newPassword || !token) {
      return NextResponse.json(
        { error: "New password and token are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // Use Better Auth's resetPassword function
    const data = await auth.api.resetPassword({
      body: {
        newPassword,
        token
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: "Password reset successfully" 
    })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    )
  }
}
