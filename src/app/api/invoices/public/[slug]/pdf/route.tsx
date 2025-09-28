import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { renderToBuffer } from "@react-pdf/renderer"
import { InvoicePDF } from "@/components/invoice-pdf"

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

    const buffer = await renderToBuffer(<InvoicePDF invoice={invoice} />)

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