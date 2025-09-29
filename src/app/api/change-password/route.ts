import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { newPassword, currentPassword, revokeOtherSessions } = await request.json()

    if (!newPassword || !currentPassword) {
      return NextResponse.json(
        { error: "New password and current password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // Use Better Auth's changePassword function
    const data = await auth.api.changePassword({
      body: {
        newPassword,
        currentPassword,
        revokeOtherSessions: revokeOtherSessions || false
      },
      headers: await headers()
    })

    return NextResponse.json({ 
      success: true, 
      message: "Password changed successfully" 
    })
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    )
  }
}
