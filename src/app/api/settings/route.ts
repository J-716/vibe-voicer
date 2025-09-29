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

    // Get user settings
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { settings: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      personal: {
        fullName: user.name || "",
        email: user.email || "",
        phone: user.settings?.phone || "",
        address: user.settings?.address || "",
        city: user.settings?.city || "",
        state: user.settings?.state || "",
        zipCode: user.settings?.zipCode || "",
        country: user.settings?.country || ""
      },
      invoice: {
        taxRate: user.settings?.taxRate || 0,
        currency: user.settings?.currency || "USD",
        invoicePrefix: user.settings?.invoicePrefix || "INV",
        nextInvoiceNumber: user.settings?.nextInvoiceNumber || 1,
        paymentTerms: user.settings?.paymentTerms || ""
      }
    })
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
    const { personal, invoice } = body

    // Update user basic info
    if (personal) {
      await db.user.update({
        where: { id: session.user.id },
        data: {
          name: personal.fullName,
          email: personal.email,
        }
      })

      // Update or create user settings
      await db.settings.upsert({
        where: { userId: session.user.id },
        update: {
          phone: personal.phone || "",
          address: personal.address || "",
          city: personal.city || "",
          state: personal.state || "",
          zipCode: personal.zipCode || "",
          country: personal.country || ""
        },
        create: {
          userId: session.user.id,
          phone: personal.phone || "",
          address: personal.address || "",
          city: personal.city || "",
          state: personal.state || "",
          zipCode: personal.zipCode || "",
          country: personal.country || ""
        }
      })
    }

    // Update invoice settings
    if (invoice) {
      await db.settings.upsert({
        where: { userId: session.user.id },
        update: {
          taxRate: invoice.taxRate || 0,
          currency: invoice.currency || "USD",
          invoicePrefix: invoice.invoicePrefix || "INV",
          nextInvoiceNumber: invoice.nextInvoiceNumber || 1,
          paymentTerms: invoice.paymentTerms || ""
        },
        create: {
          userId: session.user.id,
          taxRate: invoice.taxRate || 0,
          currency: invoice.currency || "USD",
          invoicePrefix: invoice.invoicePrefix || "INV",
          nextInvoiceNumber: invoice.nextInvoiceNumber || 1,
          paymentTerms: invoice.paymentTerms || ""
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}