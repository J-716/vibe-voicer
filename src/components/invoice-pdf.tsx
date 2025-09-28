import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"

// Register fonts
Font.register({
  family: "Inter",
  src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
})

Font.register({
  family: "DancingScript",
  src: "https://fonts.gstatic.com/s/dancingscript/v25/If2cXTr6YSzFjSqE8oF2QkPo2WlQ.woff2",
})

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Inter",
    fontSize: 10,
  },
  // Logo section - centered at top
  logoSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1e40af",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoText: {
    fontSize: 14,
    color: "#ffffff",
    fontFamily: "DancingScript",
    textAlign: "center",
    marginBottom: 2,
  },
  logoSubtext: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  logoBottomText: {
    fontSize: 9,
    color: "#374151",
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
  },
  // Blue divider line
  divider: {
    height: 3,
    backgroundColor: "#3b82f6",
    marginBottom: 25,
  },
  // Header section
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  companySection: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  companyEmail: {
    fontSize: 10,
    color: "#6b7280",
  },
  invoiceSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 12,
    textAlign: "right",
  },
  invoiceNumberContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  invoiceNumberLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 6,
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#374151",
    backgroundColor: "#f1f5f9",
    padding: "8px 16px",
    borderRadius: 6,
    border: "1px solid #e2e8f0",
    fontWeight: "bold",
    textAlign: "center",
  },
  invoiceDate: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 8,
  },
  statusBadge: {
    fontSize: 10,
    color: "#ffffff",
    backgroundColor: "#10b981",
    padding: "6px 12px",
    borderRadius: 4,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // Client section
  clientSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  clientName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 3,
  },
  clientCompany: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 3,
  },
  clientEmail: {
    fontSize: 10,
    color: "#6b7280",
  },
  // Table section
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e40af",
    padding: 14,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: "row",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#f8fafc",
  },
  tableCell: {
    fontSize: 10,
    color: "#374151",
  },
  descriptionColumn: {
    flex: 3,
  },
  quantityColumn: {
    flex: 1,
    textAlign: "center",
  },
  priceColumn: {
    flex: 1,
    textAlign: "right",
  },
  totalColumn: {
    flex: 1,
    textAlign: "right",
  },
  // Bottom section with bank details and totals
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  bankDetails: {
    flex: 1,
    marginRight: 30,
  },
  bankDetailsTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bankDetailsText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.4,
    marginBottom: 3,
  },
  totalsSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    width: 220,
  },
  totalLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 10,
    color: "#374151",
    fontWeight: "bold",
  },
  finalTotal: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e40af",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    marginTop: 8,
  },
  // Thank you section
  thankYou: {
    marginTop: 40,
    textAlign: "right",
  },
  thankYouText: {
    fontSize: 20,
    color: "#1f2937",
    fontFamily: "DancingScript",
    fontStyle: "italic",
  },
  // Footer line
  footer: {
    marginTop: 20,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
})

interface InvoicePDFProps {
  invoice: any
}

export function InvoicePDF({ invoice }: InvoicePDFProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo Section - Centered at top */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>the</Text>
            <Text style={styles.logoSubtext}>CIRCLE</Text>
          </View>
          <Text style={styles.logoBottomText}>DESIGN STUDIO</Text>
        </View>

        {/* Blue Divider Line */}
        <View style={styles.divider} />

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.companySection}>
            <Text style={styles.companyName}>
              {invoice.user?.name || "Your Company"}
            </Text>
            <Text style={styles.companyEmail}>
              {invoice.user?.email || "your@email.com"}
            </Text>
          </View>
          <View style={styles.invoiceSection}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <View style={styles.invoiceNumberContainer}>
              <Text style={styles.invoiceNumberLabel}>INVOICE NO:</Text>
              <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
            </View>
            <Text style={styles.invoiceDate}>{formatDate(invoice.issueDate)}</Text>
            <Text style={styles.statusBadge}>DRAFT</Text>
          </View>
        </View>

        {/* Client Section */}
        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>ISSUED TO:</Text>
          <Text style={styles.clientName}>{invoice.client.name}</Text>
          {invoice.client.company && (
            <Text style={styles.clientCompany}>{invoice.client.company}</Text>
          )}
          {invoice.client.email && (
            <Text style={styles.clientEmail}>{invoice.client.email}</Text>
          )}
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.descriptionColumn]}>
              DESCRIPTION
            </Text>
            <Text style={[styles.tableHeaderText, styles.quantityColumn]}>
              QTY
            </Text>
            <Text style={[styles.tableHeaderText, styles.priceColumn]}>
              UNIT PRICE
            </Text>
            <Text style={[styles.tableHeaderText, styles.totalColumn]}>
              TOTAL
            </Text>
          </View>
          {invoice.items.map((item: any, index: number) => (
            <View 
              key={index} 
              style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
            >
              <Text style={[styles.tableCell, styles.descriptionColumn]}>
                {item.description}
              </Text>
              <Text style={[styles.tableCell, styles.quantityColumn]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCell, styles.priceColumn]}>
                {formatCurrency(Number(item.unitPrice))}
              </Text>
              <Text style={[styles.tableCell, styles.totalColumn]}>
                {formatCurrency(Number(item.total))}
              </Text>
            </View>
          ))}
        </View>

        {/* Bottom Section - Bank Details and Totals */}
        <View style={styles.bottomSection}>
          <View style={styles.bankDetails}>
            <Text style={styles.bankDetailsTitle}>BANK DETAILS</Text>
            <Text style={styles.bankDetailsText}>Borcele Bank</Text>
            <Text style={styles.bankDetailsText}>Account Name: Avery Davis</Text>
            <Text style={styles.bankDetailsText}>Account No.: 123-456-7890</Text>
            <Text style={styles.bankDetailsText}>Pay by: {formatDate(invoice.dueDate)}</Text>
          </View>
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(Number(invoice.subtotal))}
              </Text>
            </View>
            {Number(invoice.taxAmount) > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax</Text>
                <Text style={styles.totalValue}>{invoice.taxRate}%</Text>
              </View>
            )}
            <View style={[styles.totalRow, styles.finalTotal]}>
              <Text style={styles.finalTotal}>Amount due</Text>
              <Text style={styles.finalTotal}>
                {formatCurrency(Number(invoice.total))}
              </Text>
            </View>
          </View>
        </View>

        {/* Thank You Message */}
        <View style={styles.thankYou}>
          <Text style={styles.thankYouText}>thank You</Text>
        </View>

        {/* Footer Line */}
        <View style={styles.footer} />
      </Page>
    </Document>
  )
}