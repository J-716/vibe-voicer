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

    // Convert Decimal fields to numbers and recalculate totals
    const items = invoice.items.map(item => {
      const quantity = Number(item.quantity)
      const unitPrice = Number(item.unitPrice)
      const total = quantity * unitPrice
      return {
        ...item,
        quantity,
        unitPrice,
        total,
      }
    })

    // Recalculate totals from items
    const recalculatedSubtotal = items.reduce((sum, item) => sum + item.total, 0)
    const discountValue = Number(invoice.discountValue)
    const discountAmount = Number(invoice.discountAmount)
    const taxRate = Number(invoice.taxRate)
    
    // Calculate discount
    let calculatedDiscountAmount = 0
    if (discountValue > 0) {
      if (invoice.discountType === "PERCENTAGE") {
        calculatedDiscountAmount = (recalculatedSubtotal * discountValue) / 100
      } else {
        calculatedDiscountAmount = discountValue
      }
    }
    
    const subtotalAfterDiscount = recalculatedSubtotal - calculatedDiscountAmount
    const calculatedTaxAmount = (subtotalAfterDiscount * taxRate) / 100
    const calculatedTotal = subtotalAfterDiscount + calculatedTaxAmount

    const serializedInvoice = {
      ...invoice,
      subtotal: recalculatedSubtotal,
      discountValue: discountValue,
      discountAmount: calculatedDiscountAmount,
      taxRate: taxRate,
      taxAmount: calculatedTaxAmount,
      total: calculatedTotal,
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
      items,
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