import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { processPaymentTerms } from "@/lib/payment-terms"

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 15,
    fontFamily: "Helvetica",
    color: "#000000",
    lineHeight: 1.2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: "2px solid #000000",
  },
  companyInfo: {
    flexDirection: "column",
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#000000",
    textAlign: "left",
  },
  companyDetails: {
    fontSize: 10,
    lineHeight: 1.3,
    color: "#000000",
    textAlign: "left",
  },
  invoiceInfo: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000000",
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 10,
    color: "#000000",
    backgroundColor: "#f5f5f5",
    padding: "6px 12px",
    borderRadius: 4,
    border: "1px solid #000000",
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    width: "auto",
    marginBottom: 6,
  },
  statusBadge: {
    fontSize: 12,
    color: "#000000",
    backgroundColor: "#f5f5f5",
    padding: "12px 20px",
    borderRadius: 4,
    marginTop: 6,
    textTransform: "uppercase",
    fontWeight: "bold",
    alignSelf: "center",
    width: "auto",
    letterSpacing: 1,
    border: "1px solid #000000",
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  clientInfo: {
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 4,
    border: "1px solid #000000",
    flex: 1,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clientDetails: {
    fontSize: 9,
    lineHeight: 1.2,
    color: "#000000",
  },
  invoiceDetails: {
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 4,
    border: "1px solid #000000",
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  table: {
    marginTop: 10,
    border: "2px solid #000000",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#000000",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "1px solid #000000",
    backgroundColor: "#ffffff",
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "1px solid #000000",
    backgroundColor: "#f9f9f9",
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableCell: {
    fontSize: 9,
    color: "#000000",
  },
  currencyCell: {
    fontSize: 9,
    color: "#000000",
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
    marginTop: 10,
    alignItems: "flex-end",
  },
  totalsTable: {
    width: 250,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 4,
    border: "1px solid #000000",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 9,
    color: "#000000",
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000000",
  },
  finalTotal: {
    fontSize: 14,
    fontWeight: "bold",
    paddingTop: 8,
    marginTop: 8,
    color: "#000000",
    borderTop: "1px solid #000000",
  },
  currencyValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "right",
    fontFamily: "Courier",
  },
  finalCurrencyValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "right",
    fontFamily: "Courier",
  },
  discountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    border: "2px solid #000000",
  },
  thankYou: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 12,
    color: "#000000",
    fontStyle: "italic",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 6,
    border: "2px solid #000000",
  },
  footer: {
    marginTop: 15,
    paddingTop: 10,
    borderTop: "1px solid #000000",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactInfo: {
    fontSize: 9,
    color: "#000000",
    lineHeight: 1.2,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    border: "1px solid #000000",
  },
  pageNumber: {
    fontSize: 9,
    color: "#666666",
    textAlign: "right",
  },
  notes: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    border: "1px solid #000000",
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  notesText: {
    fontSize: 9,
    lineHeight: 1.2,
    color: "#000000",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 4,
    border: "1px solid #000000",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 9,
    color: "#000000",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 12,
    color: "#000000",
    fontWeight: "bold",
  },
})

interface BlackWhiteInvoicePDFProps {
  invoice: any
}

export function BlackWhiteInvoicePDF({ invoice }: BlackWhiteInvoicePDFProps) {
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


  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>
              {invoice.company?.name || invoice.user?.name || "Your Company"}
            </Text>
            {invoice.company?.email && (
              <Text style={styles.companyDetails}>{invoice.company.email}</Text>
            )}
            {invoice.company?.phone && (
              <Text style={styles.companyDetails}>{invoice.company.phone}</Text>
            )}
            {(invoice.company?.address || invoice.company?.city || invoice.company?.state || invoice.company?.country) && (
              <Text style={styles.companyDetails}>
                {invoice.company?.address && `${invoice.company.address}\n`}
                {invoice.company?.city && invoice.company?.state 
                  ? `${invoice.company.city}, ${invoice.company.state} ${invoice.company.zipCode || ""}`.trim()
                  : invoice.company?.city || invoice.company?.state || ""
                }
                {invoice.company?.country && `\n${invoice.company.country}`}
              </Text>
            )}
            
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <View style={{ 
              alignItems: "center", 
              justifyContent: "center",
              width: "100%",
              minHeight: 40,
              display: "flex"
            }}>
             {invoice.status && (
                <Text style={styles.statusBadge}>{invoice.status}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {invoice.invoiceNumber && (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Invoice #</Text>
              <Text style={styles.statValue}>{invoice.invoiceNumber}</Text>
            </View>
          )}
          {invoice.issueDate && (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Issue Date</Text>
              <Text style={styles.statValue}>{new Date(invoice.issueDate).toLocaleDateString()}</Text>
            </View>
          )}
          {invoice.dueDate && (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Due Date</Text>
              <Text style={styles.statValue}>{new Date(invoice.dueDate).toLocaleDateString()}</Text>
            </View>
          )}
          {invoice.total && (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Amount</Text>
              <Text style={styles.statValue}>{formatCurrency(invoice.total)}</Text>
            </View>
          )}
        </View>

        {/* Client Info and Invoice Details Side by Side */}
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <View style={styles.clientInfo}>
            <Text style={styles.sectionTitle}>Bill To:</Text>
            <View style={styles.clientDetails}>
              {invoice.client?.name && <Text>{invoice.client.name}</Text>}
              {invoice.client?.email && <Text>{invoice.client.email}</Text>}
              {invoice.client?.phone && <Text>{invoice.client.phone}</Text>}
              {(invoice.client?.address || invoice.client?.city || invoice.client?.state || invoice.client?.country) && (
                <Text>
                  {invoice.client?.address && `${invoice.client.address}\n`}
                  {invoice.client?.city && invoice.client?.state 
                    ? `${invoice.client.city}, ${invoice.client.state} ${invoice.client.zipCode || ""}`.trim()
                    : invoice.client?.city || invoice.client?.state || ""
                  }
                  {invoice.client?.country && `\n${invoice.client.country}`}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.invoiceDetails}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>
            <View style={styles.clientDetails}>
              {invoice.issueDate && (
                <Text><Text style={{ fontWeight: "bold" }}>Invoice Date:</Text> {formatDate(invoice.issueDate)}</Text>
              )}
              {invoice.dueDate && (
                <Text><Text style={{ fontWeight: "bold" }}>Due Date:</Text> {formatDate(invoice.dueDate)}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Items Table */}
        {invoice.items && invoice.items.length > 0 && (
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
            {invoice.items.map((item: any, index: number) => (
              <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, styles.descriptionColumn]}>
                  {item.description || "Item"}
                </Text>
                <Text style={[styles.tableCell, styles.quantityColumn]}>
{Math.round(item.quantity || 0)}
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
        )}

        {/* Totals */}
        {(invoice.subtotal || invoice.total) && (
          <View style={styles.totals}>
            <View style={styles.totalsTable}>
              {invoice.subtotal && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal:</Text>
                  <Text style={styles.currencyValue}>
                    {formatCurrency(invoice.subtotal)}
                  </Text>
                </View>
              )}
              {Number(invoice.discountAmount) > 0 && (
                <View style={styles.discountRow}>
                  <Text style={styles.totalLabel}>
                    Discount ({invoice.discountType === "PERCENTAGE" ? `${invoice.discountValue}%` : "Fixed"}):
                  </Text>
                  <Text style={styles.currencyValue}>
                    -{formatCurrency(invoice.discountAmount)}
                  </Text>
                </View>
              )}
              {invoice.discountAmount > 0 && invoice.subtotal && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal after discount:</Text>
                  <Text style={styles.currencyValue}>
                    {formatCurrency(Number(invoice.subtotal) - Number(invoice.discountAmount))}
                  </Text>
                </View>
              )}
              {Number(invoice.taxAmount) > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>
                    Tax ({invoice.taxRate || 0}%):
                  </Text>
                  <Text style={styles.currencyValue}>
                    {formatCurrency(invoice.taxAmount)}
                  </Text>
                </View>
              )}
              {invoice.total && (
                <View style={[styles.totalRow, styles.finalTotal]}>
                  <Text style={styles.finalTotal}>Total:</Text>
                  <Text style={styles.finalCurrencyValue}>
                    {formatCurrency(invoice.total)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

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
