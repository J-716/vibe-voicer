import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import { processPaymentTerms } from "@/lib/payment-terms"

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 15,
    fontFamily: "Helvetica",
    color: "#1f2937",
    lineHeight: 1.2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1px solid #3b82f6",
  },
  companyInfo: {
    flexDirection: "column",
  },
  logoContainer: {
    width: 60,
    height: 60,
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  logoImage: {
    width: 60,
    height: 60,
    objectFit: "contain",
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "bold",
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1e40af",
    textAlign: "left",
  },
  companyDetails: {
    fontSize: 11,
    lineHeight: 1.4,
    color: "#64748b",
    textAlign: "left",
  },
  invoiceInfo: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1e40af",
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#374151",
    backgroundColor: "#f8fafc",
    padding: "6px 12px",
    borderRadius: 8,
    border: "2px solid #e2e8f0",
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    width: "auto",
    marginBottom: 4,
  },
  statusBadge: {
    fontSize: 10,
    color: "#ffffff",
    backgroundColor: "#10b981",
    padding: "6px 12px",
    borderRadius: 8,
    marginTop: 4,
    textTransform: "uppercase",
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    width: "auto",
    letterSpacing: 0.5,
  },
  clientInfo: {
    marginBottom: 8,
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 4,
    border: "1px solid #e2e8f0",
    flex: 1,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#1e40af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clientDetails: {
    fontSize: 9,
    lineHeight: 1.2,
    color: "#374151",
  },
  invoiceDetails: {
    marginBottom: 2,
    backgroundColor: "#f8fafc",
    padding: 2,
    borderRadius: 4,
    border: "1px solid #e2e8f0",
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  table: {
    marginTop: 8,
    border: "1px solid #e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e40af",
    padding: 6,
  },
  tableRow: {
    flexDirection: "row",
    padding: 6,
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: 6,
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableCell: {
    fontSize: 9,
    color: "#374151",
  },
  currencyCell: {
    fontSize: 9,
    color: "#374151",
    textAlign: "right",
    fontFamily: "Courier",
    fontWeight: "500",
  },
  descriptionColumn: {
    flex: 3,
  },
  quantityColumn: {
    flex: 1,
    textAlign: "center",
  },
  priceColumn: {
    flex: 1.5,
    textAlign: "right",
  },
  totalColumn: {
    flex: 1.5,
    textAlign: "right",
  },
  totals: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  totalsTable: {
    width: 240,
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 4,
    border: "1px solid #e2e8f0",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 3,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 9,
    color: "#64748b",
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#374151",
  },
  finalTotal: {
    fontSize: 12,
    fontWeight: "bold",
    paddingTop: 6,
    marginTop: 6,
    color: "#1e40af",
  },
  currencyValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "right",
    fontFamily: "Courier",
  },
  finalCurrencyValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e40af",
    textAlign: "right",
    fontFamily: "Courier",
  },
  discountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderRadius: 4,
  },
  thankYou: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 9,
    color: "#64748b",
    fontStyle: "italic",
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 4,
    border: "1px solid #e2e8f0",
  },
  footer: {
    marginTop: 10,
    paddingTop: 6,
    borderTop: "1px solid #e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactInfo: {
    fontSize: 9,
    color: "#64748b",
    lineHeight: 1.3,
    marginBottom: 8,
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    border: "1px solid #e2e8f0",
  },
  pageNumber: {
    fontSize: 9,
    color: "#9ca3af",
    textAlign: "right",
  },
  notes: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    border: "1px solid #e2e8f0",
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1e40af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  notesText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: "#374151",
  },
})

interface SimpleInvoicePDFProps {
  invoice: any
}

export function SimpleInvoicePDF({ invoice }: SimpleInvoicePDFProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  console.log("SimpleInvoicePDF rendering with invoice:", invoice)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo at Top */}
        <View style={styles.logoContainer}>
          {invoice.logo ? (
            <Image style={styles.logoImage} src={invoice.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>LOGO</Text>
            </View>
          )}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>
              {invoice.user?.name || "Your Company"}
            </Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <View style={{ alignItems: "center", width: "100%", marginTop: 8 }}>
              <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactInfo}>
          <Text style={{ fontWeight: "bold", fontSize: 10, marginBottom: 4, color: "#1e40af" }}>Contact Information</Text>
          <Text style={{ fontSize: 9, color: "#374151" }}>Phone: {invoice.user?.phone || "(555) 123-4567"}</Text>
          <Text style={{ fontSize: 9, color: "#374151" }}>Website: www.yourcompany.com</Text>
          <Text style={{ fontSize: 9, color: "#374151" }}>Email: {invoice.user?.email || "your@email.com"}</Text>
        </View>

        {/* Client Info and Invoice Details Side by Side */}
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          <View style={styles.clientInfo}>
            <Text style={styles.sectionTitle}>Bill To:</Text>
            <View style={styles.clientDetails}>
              <Text>{invoice.client?.name || "Client Name"}</Text>
              {invoice.client?.email && <Text>{invoice.client.email}</Text>}
            </View>
          </View>

          <View style={styles.invoiceDetails}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>
            <View style={styles.clientDetails}>
              <Text><Text style={{ fontWeight: "bold" }}>Invoice Date:</Text> {formatDate(invoice.issueDate)}</Text>
              <Text><Text style={{ fontWeight: "bold" }}>Due Date:</Text> {formatDate(invoice.dueDate)}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.descriptionColumn]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderText, styles.quantityColumn]}>
              Qty
            </Text>
            <Text style={[styles.tableHeaderText, styles.priceColumn]}>
              Unit Price
            </Text>
            <Text style={[styles.tableHeaderText, styles.totalColumn]}>
              Total
            </Text>
          </View>
          {invoice.items?.map((item: any, index: number) => (
            <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <Text style={[styles.tableCell, styles.descriptionColumn]}>
                {item.description || "Item"}
              </Text>
              <Text style={[styles.tableCell, styles.quantityColumn]}>
                {item.quantity || 0}
              </Text>
              <Text style={[styles.currencyCell, styles.priceColumn]}>
                {formatCurrency(item.unitPrice || 0)}
              </Text>
              <Text style={[styles.currencyCell, styles.totalColumn]}>
                {formatCurrency(item.total || 0)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalsTable}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.currencyValue}>
                {formatCurrency(invoice.subtotal || 0)}
              </Text>
            </View>
            {Number(invoice.discountAmount) > 0 && (
              <View style={styles.discountRow}>
                <Text style={styles.totalLabel}>
                  Discount ({invoice.discountType === "PERCENTAGE" ? `${invoice.discountValue}%` : "Fixed"}):
                </Text>
                <Text style={styles.currencyValue}>
                  -{formatCurrency(invoice.discountAmount || 0)}
                </Text>
              </View>
            )}
            {Number(invoice.taxAmount) > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Tax ({invoice.taxRate || 0}%):
                </Text>
                <Text style={styles.currencyValue}>
                  {formatCurrency(invoice.taxAmount || 0)}
                </Text>
              </View>
            )}
            <View style={[styles.totalRow, styles.finalTotal]}>
              <Text style={styles.finalTotal}>Total:</Text>
              <Text style={styles.finalCurrencyValue}>
                {formatCurrency(invoice.total || 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Terms */}
        {invoice.paymentTerms && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Payment Terms</Text>
            <Text style={styles.notesText}>
              {processPaymentTerms(invoice.paymentTerms, invoice.issueDate, invoice.dueDate)}
            </Text>
          </View>
        )}

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Thank You Message */}
        <View style={styles.thankYou}>
          <Text>Thank you for your business!</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.pageNumber}>
            <Text>Page 1 of 1</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
