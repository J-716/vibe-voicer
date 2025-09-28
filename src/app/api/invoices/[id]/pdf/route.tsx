import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { renderToBuffer } from "@react-pdf/renderer"
import { SimpleInvoicePDF } from "@/components/simple-invoice-pdf"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("PDF route called, checking session...")
    console.log("Request headers:", Object.fromEntries(request.headers.entries()))
    
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    console.log("Session result:", session ? "Found" : "Not found")

    if (!session) {
      console.log("No session found, returning unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    console.log("PDF generation request for invoice ID:", id)
    const invoice = await db.invoice.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        client: true,
        items: true,
        payments: true,
        user: {
          select: {
            name: true,
            email: true,
            settings: true,
          },
        },
      },
    })

    if (!invoice) {
      console.log("Invoice not found for ID:", id)
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    console.log("Invoice found, generating PDF for:", invoice.invoiceNumber)
    console.log("Invoice data:", JSON.stringify(invoice, null, 2))

    // Convert Decimal fields to numbers and recalculate totals for PDF generation
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

    // Recalculate totals
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const taxRate = Number(invoice.taxRate)
    const taxAmount = subtotal * (taxRate / 100)
    const total = subtotal + taxAmount

    const serializedInvoice = {
      ...invoice,
      subtotal,
      discountValue: Number(invoice.discountValue),
      discountAmount: Number(invoice.discountAmount),
      taxRate,
      taxAmount,
      total,
      items,
      logo: invoice.user?.settings?.logo || null,
      user: {
        name: invoice.user?.name || "Your Company",
        email: invoice.user?.email || "your@email.com",
        settings: invoice.user?.settings || null,
      },
    }

    console.log("Serialized invoice data:", JSON.stringify(serializedInvoice, null, 2))

    let buffer
    try {
      console.log("Starting PDF rendering...")
      console.log("Invoice data structure:", {
        hasUser: !!serializedInvoice.user,
        hasClient: !!serializedInvoice.client,
        hasItems: !!serializedInvoice.items,
        itemsCount: serializedInvoice.items?.length || 0,
        userData: serializedInvoice.user,
      })
      
      buffer = await renderToBuffer(<SimpleInvoicePDF invoice={serializedInvoice} />)
      console.log("PDF generated successfully, buffer size:", buffer.length)
    } catch (pdfError) {
      console.error("Error during PDF rendering:", pdfError)
      
      // Type guard to check if error is an Error instance
      if (pdfError instanceof Error) {
        console.error("PDF error stack:", pdfError.stack)
        console.error("PDF error details:", {
          name: pdfError.name,
          message: pdfError.message,
          cause: pdfError.cause,
        })
        throw new Error(`PDF rendering failed: ${pdfError.message}`)
      } else {
        // Handle non-Error objects
        console.error("PDF error details:", pdfError)
        throw new Error(`PDF rendering failed: ${String(pdfError)}`)
      }
    }

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    )
  }
}