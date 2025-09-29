import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { settings: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      taxRate: user.settings?.taxRate ? Number(user.settings.taxRate) : 0,
      currency: user.settings?.currency || "USD",
      invoicePrefix: user.settings?.invoicePrefix || "INV",
      nextInvoiceNumber: user.settings?.nextInvoiceNumber || 1,
      paymentTerms: user.settings?.paymentTerms || "",
    })
  } catch (error) {
    console.error("Error fetching invoice settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch invoice settings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { taxRate, currency, invoicePrefix, nextInvoiceNumber, paymentTerms } = body

    console.log("Received invoice settings:", { taxRate, currency, invoicePrefix, nextInvoiceNumber, paymentTerms })

    // Update or create user settings
    const result = await db.settings.upsert({
      where: { userId: session.user.id },
      update: {
        taxRate: taxRate || 0,
        currency: currency || "USD",
        invoicePrefix: invoicePrefix || "INV",
        nextInvoiceNumber: nextInvoiceNumber || 1,
        paymentTerms: paymentTerms || "",
      },
      create: {
        userId: session.user.id,
        taxRate: taxRate || 0,
        currency: currency || "USD",
        invoicePrefix: invoicePrefix || "INV",
        nextInvoiceNumber: nextInvoiceNumber || 1,
        paymentTerms: paymentTerms || "",
      },
    })

    console.log("Database operation result:", result)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating invoice settings:", error)
    return NextResponse.json(
      { error: "Failed to update invoice settings" },
      { status: 500 }
    )
  }
}
