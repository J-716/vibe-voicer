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

    const invoices = await db.invoice.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        client: true,
        items: true,
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Convert Decimal fields to numbers for JSON serialization
    const serializedInvoices = invoices.map(invoice => ({
      ...invoice,
      subtotal: Number(invoice.subtotal),
      discountValue: Number(invoice.discountValue),
      discountAmount: Number(invoice.discountAmount),
      taxRate: Number(invoice.taxRate),
      taxAmount: Number(invoice.taxAmount),
      total: Number(invoice.total),
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
    }))

    return NextResponse.json(serializedInvoices)
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    const {
      clientId,
      invoiceNumber,
      publicSlug,
      status,
      issueDate,
      dueDate,
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      taxRate,
      taxAmount,
      total,
      notes,
      paymentTerms,
      items,
    } = body

    // Generate invoice number if not provided
    const finalInvoiceNumber = invoiceNumber || `INV-${Date.now()}`

    // Generate public slug if not provided
    const finalPublicSlug = publicSlug || `inv-${Date.now()}`

    const invoice = await db.invoice.create({
      data: {
        userId: session.user.id,
        clientId,
        invoiceNumber: finalInvoiceNumber,
        publicSlug: finalPublicSlug,
        status: (status as any) || "DRAFT",
        issueDate: new Date(issueDate),
        dueDate: dueDate ? new Date(dueDate) : new Date(issueDate), // Use issue date as due date if not provided
        subtotal: subtotal || 0,
        discountType: (discountType as any) || "PERCENTAGE",
        discountValue: discountValue || 0,
        discountAmount: discountAmount || 0,
        taxRate: taxRate || 0,
        taxAmount: taxAmount || 0,
        total: total || 0,
        notes,
        paymentTerms,
        items: {
          create: items?.map((item: any) => ({
            description: item.description,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            total: item.total || 0,
          })) || [],
        },
      },
      include: {
        client: true,
        items: true,
        payments: true,
      },
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error("Error creating invoice:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { error: "Failed to create invoice", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
