import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { renderToBuffer } from "@react-pdf/renderer"
import { BlackWhiteInvoicePDF } from "@/components/black-white-invoice-pdf"
import { SimpleInvoicePDF } from "@/components/simple-invoice-pdf"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const style = searchParams.get('style') || 'bw' // Default to black and white
    const invoice = await db.invoice.findUnique({
      where: {
        publicSlug: slug,
      },
      include: {
        client: true,
        items: true,
        payments: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    console.log("Invoice found:", {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      itemsCount: invoice.items?.length,
      subtotal: invoice.subtotal,
      total: invoice.total
    })

    // Convert Decimal fields to numbers for JSON serialization and map user settings to company
    const processedInvoice = {
      ...invoice,
      subtotal: Number(invoice.subtotal),
      discountValue: Number(invoice.discountValue),
      discountAmount: Number(invoice.discountAmount),
      taxRate: Number(invoice.taxRate),
      taxAmount: Number(invoice.taxAmount),
      total: Number(invoice.total),
      company: {
        name: invoice.user?.name || "Your Company",
        email: invoice.user?.email || "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      items: invoice.items?.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
      })) || [],
      payments: invoice.payments?.map(payment => ({
        ...payment,
        amount: Number(payment.amount),
      })) || [],
    }

    let buffer: Buffer
    try {
      console.log("Starting PDF generation for public invoice:", invoice.id)
      
      // Use the appropriate PDF component based on style parameter
      const pdfDoc = style === 'bw' 
        ? BlackWhiteInvoicePDF({ invoice: processedInvoice })
        : SimpleInvoicePDF({ invoice: processedInvoice })
      
      buffer = await renderToBuffer(pdfDoc)
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
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    } else {
      console.error("Non-Error object:", error)
    }
    
    return NextResponse.json(
      { 
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}