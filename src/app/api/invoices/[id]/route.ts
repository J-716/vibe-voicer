import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const invoice = await db.invoice.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        client: true,
        items: true,
        payments: true,
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Convert Decimal fields to numbers for JSON serialization
    const serializedInvoice = {
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
    }

    return NextResponse.json(serializedInvoice)
  } catch (error) {
    console.error("Error fetching invoice:", error)
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const {
      clientId,
      invoiceNumber,
      publicSlug,
      status,
      issueDate,
      dueDate,
      subtotal,
      taxRate,
      taxAmount,
      total,
      notes,
      items,
    } = body

    // Check if invoice exists and user has access
    const existingInvoice = await db.invoice.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Update invoice
    const invoice = await db.invoice.update({
      where: { id },
      data: {
        clientId,
        invoiceNumber,
        publicSlug,
        status,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        subtotal: subtotal ? parseFloat(subtotal) : undefined,
        taxRate: taxRate ? parseFloat(taxRate) : undefined,
        taxAmount: taxAmount ? parseFloat(taxAmount) : undefined,
        total: total ? parseFloat(total) : undefined,
        notes,
      },
      include: {
        client: true,
        items: true,
        payments: true,
      },
    })

    // Update items if provided
    if (items) {
      // Delete existing items
      await db.invoiceItem.deleteMany({
        where: { invoiceId: id },
      })

      // Create new items
      await db.invoiceItem.createMany({
        data: items.map((item: any) => ({
          invoiceId: id,
          description: item.description,
          quantity: parseFloat(item.quantity) || 1,
          unitPrice: parseFloat(item.unitPrice) || 0,
          total: parseFloat(item.total) || 0,
        })),
      })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    // Check if invoice exists and user has access
    const existingInvoice = await db.invoice.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    await db.invoice.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Invoice deleted successfully" })
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    )
  }
}