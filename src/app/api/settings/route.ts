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

    let settings = await db.settings.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    // Create default settings if none exist
    if (!settings) {
      settings = await db.settings.create({
        data: {
          userId: session.user.id,
          companyName: "",
          email: session.user.email,
          currency: "USD",
          taxRate: 0,
        },
      })
    }

    // Map database fields to frontend expected fields, ensuring no null values
    const mappedSettings = {
      ...settings,
      defaultTaxRate: Number(settings.taxRate) || 0,
      companyEmail: settings.email || "",
      invoicePrefix: settings.invoicePrefix || "INV",
      nextInvoiceNumber: settings.nextInvoiceNumber || 1,
      paymentTerms: settings.paymentTerms || "",
      logo: settings.logo || "",
    }

    return NextResponse.json(mappedSettings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
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
    const {
      companyName,
      companyEmail,
      defaultTaxRate,
      currency,
      invoicePrefix,
      nextInvoiceNumber,
      paymentTerms,
      logo,
    } = body

    // Get existing settings to preserve fields not being updated
    const existingSettings = await db.settings.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    const updateData = {
      ...(companyName !== undefined && companyName !== null && { companyName }),
      ...(companyEmail !== undefined && companyEmail !== null && { email: companyEmail }),
      ...(defaultTaxRate !== undefined && defaultTaxRate !== null && { taxRate: parseFloat(defaultTaxRate) }),
      ...(currency !== undefined && currency !== null && { currency }),
      ...(invoicePrefix !== undefined && invoicePrefix !== null && { invoicePrefix }),
      ...(nextInvoiceNumber !== undefined && nextInvoiceNumber !== null && { nextInvoiceNumber }),
      ...(paymentTerms !== undefined && paymentTerms !== null && { paymentTerms }),
      ...(logo !== undefined && logo !== null && { logo }),
    }

    const settings = await db.settings.upsert({
      where: {
        userId: session.user.id,
      },
      update: updateData,
      create: {
        userId: session.user.id,
        companyName: companyName || "",
        email: companyEmail || session.user.email,
        taxRate: defaultTaxRate ? parseFloat(defaultTaxRate) : 0,
        currency: currency || "USD",
        invoicePrefix: invoicePrefix || "INV",
        nextInvoiceNumber: nextInvoiceNumber || 1,
        paymentTerms: paymentTerms || "",
        logo: logo || "",
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating settings:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { 
        error: "Failed to update settings", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
