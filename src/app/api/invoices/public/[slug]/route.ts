import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const invoice = await db.invoice.findUnique({
      where: {
        publicSlug: slug,
      },
      include: {
        client: true,
        items: true,
        payments: true,
        user: {
          include: {
            settings: true,
          },
        },
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Convert Decimal fields to numbers for JSON serialization and map user settings to company
    const serializedInvoice = {
      ...invoice,
      subtotal: Number(invoice.subtotal),
      discountValue: Number(invoice.discountValue),
      discountAmount: Number(invoice.discountAmount),
      taxRate: Number(invoice.taxRate),
      taxAmount: Number(invoice.taxAmount),
      total: Number(invoice.total),
      company: {
        name: invoice.user.settings?.companyName || invoice.user.name || "Your Company",
        email: invoice.user.settings?.email || invoice.user.email || "",
        phone: invoice.user.settings?.phone || "",
        address: invoice.user.settings?.address || "",
        city: invoice.user.settings?.city || "",
        state: invoice.user.settings?.state || "",
        zipCode: invoice.user.settings?.zipCode || "",
        country: invoice.user.settings?.country || "",
      },
      items: invoice.items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
      })),
      payments: invoice.payments.map(payment => ({
        ...payment,
        amount: Number(payment.amount),
      })),
    }

    return NextResponse.json(serializedInvoice)
  } catch (error) {
    console.error("Error fetching public invoice:", error)
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    )
  }
}