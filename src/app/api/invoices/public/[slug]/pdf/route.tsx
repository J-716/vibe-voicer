import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { renderToBuffer } from "@react-pdf/renderer"
import React from "react"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

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

    console.log("Invoice found:", {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      itemsCount: invoice.items?.length,
      subtotal: invoice.subtotal,
      total: invoice.total
    })

    // Calculate item totals if they're missing and ensure all required fields exist
    const processedInvoice = {
      ...invoice,
      logo: null, // No logo for now
      user: {
        name: invoice.user?.name || "Your Company",
        email: invoice.user?.email || "your@email.com",
        phone: "(555) 123-4567", // Default phone
      },
      items: invoice.items?.map(item => ({
        ...item,
        total: item.total || (Number(item.quantity) * Number(item.unitPrice))
      })) || [],
      client: {
        name: invoice.client?.name || "Client Name",
        email: invoice.client?.email || "",
        company: "", // No company field in client
      },
      // Ensure all required fields exist
      subtotal: Number(invoice.subtotal) || 0,
      total: Number(invoice.total) || 0,
      taxAmount: Number(invoice.taxAmount) || 0,
      taxRate: Number(invoice.taxRate) || 0,
      discountAmount: Number(invoice.discountAmount) || 0,
      discountType: invoice.discountType || "PERCENTAGE",
      discountValue: Number(invoice.discountValue) || 0,
      paymentTerms: invoice.paymentTerms || "",
      notes: invoice.notes || "",
      issueDate: invoice.issueDate || new Date().toISOString(),
      dueDate: invoice.dueDate || new Date().toISOString()
    }

    let buffer: Buffer
    try {
      console.log("Starting PDF generation for public invoice:", invoice.id)
      
      // Create PDF using React PDF API directly
      const styles = StyleSheet.create({
        page: {
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          padding: 30,
          fontFamily: 'Helvetica',
        },
        header: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
          color: '#1e40af',
        },
        section: {
          marginBottom: 15,
        },
        label: {
          fontSize: 12,
          fontWeight: 'bold',
          color: '#374151',
        },
        value: {
          fontSize: 10,
          color: '#6b7280',
          marginBottom: 5,
        },
        table: {
          marginTop: 20,
        },
        tableRow: {
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          paddingVertical: 8,
        },
        tableHeader: {
          backgroundColor: '#f3f4f6',
          fontWeight: 'bold',
        },
        tableCell: {
          flex: 1,
          fontSize: 10,
        },
        total: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#1e40af',
          marginTop: 10,
        }
      })

      // Create items table rows
      const itemRows = (invoice.items || []).map((item: any, index: number) =>
        React.createElement(View, { key: index, style: styles.tableRow },
          React.createElement(Text, { style: styles.tableCell }, item.description || ''),
          React.createElement(Text, { style: styles.tableCell }, String(item.quantity || 0)),
          React.createElement(Text, { style: styles.tableCell }, `$${Number(item.unitPrice) || 0}`),
          React.createElement(Text, { style: styles.tableCell }, `$${Number(item.total) || (Number(item.quantity) * Number(item.unitPrice)) || 0}`)
        )
      )

      const pdfDoc = React.createElement(Document, {},
        React.createElement(Page, { size: "A4", style: styles.page },
          // Header
          React.createElement(Text, { style: styles.header }, 'INVOICE'),
          
          // Invoice Details
          React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.label }, 'Invoice Number:'),
            React.createElement(Text, { style: styles.value }, invoice.invoiceNumber),
            React.createElement(Text, { style: styles.label }, 'Issue Date:'),
            React.createElement(Text, { style: styles.value }, new Date(invoice.issueDate).toLocaleDateString()),
            React.createElement(Text, { style: styles.label }, 'Due Date:'),
            React.createElement(Text, { style: styles.value }, new Date(invoice.dueDate).toLocaleDateString())
          ),
          
          // Client Details
          React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.label }, 'Bill To:'),
            React.createElement(Text, { style: styles.value }, invoice.client?.name || 'N/A'),
            React.createElement(Text, { style: styles.value }, invoice.client?.email || ''),
            React.createElement(Text, { style: styles.value }, invoice.client?.address || ''),
            React.createElement(Text, { style: styles.value }, `${invoice.client?.city || ''}, ${invoice.client?.state || ''} ${invoice.client?.zipCode || ''}`)
          ),
          
          // Items Table
          React.createElement(View, { style: styles.table },
            React.createElement(View, { style: [styles.tableRow, styles.tableHeader] },
              React.createElement(Text, { style: styles.tableCell }, 'Description'),
              React.createElement(Text, { style: styles.tableCell }, 'Qty'),
              React.createElement(Text, { style: styles.tableCell }, 'Unit Price'),
              React.createElement(Text, { style: styles.tableCell }, 'Total')
            ),
            ...itemRows
          ),
          
          // Totals
          React.createElement(View, { style: { marginTop: 20, alignItems: 'flex-end' } },
            React.createElement(Text, { style: styles.total }, `Subtotal: $${Number(invoice.subtotal) || 0}`),
            Number(invoice.taxAmount) > 0 && React.createElement(Text, { style: styles.value }, `Tax (${Number(invoice.taxRate)}%): $${Number(invoice.taxAmount)}`),
            React.createElement(Text, { style: styles.total }, `Total: $${Number(invoice.total) || 0}`)
          )
        )
      )
      
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