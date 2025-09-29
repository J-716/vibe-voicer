"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Download, ArrowLeft, FileText, Building2, Mail, Phone, MapPin, DollarSign, Calendar, BarChart3, Clock, CheckCircle } from "lucide-react"
import { processPaymentTerms } from "@/lib/payment-terms"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { formatCurrency, formatQuantity } from "@/lib/utils"

interface Invoice {
  id: string
  invoiceNumber: string
  publicSlug: string
  status: string
  issueDate: string
  dueDate: string
  company: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  client: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  discountType: string
  discountValue: number
  discountAmount: number
  taxRate: number
  taxAmount: number
  total: number
  notes: string
}

export default function PublicInvoicePage() {
  const params = useParams()
  const slug = params.slug as string
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/invoices/public/${slug}`)
        if (!response.ok) {
          throw new Error("Invoice not found")
        }
        const data = await response.json()
        setInvoice(data)
      } catch (error) {
        console.error("Error fetching invoice:", error)
        setError("Invoice not found")
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchInvoice()
    }
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--mauve)]/5 via-[var(--blue)]/5 to-[var(--peach)]/5"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InZhcig--bWF1dmUpIiBmaWxsLW9wYWNpdHk9IjAuMDMiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--mauve)]/20 to-[var(--pink)]/20 rounded-3xl mb-8 group">
                <FileText className="h-10 w-10 text-[var(--mauve)] animate-pulse" />
              </div>
              <h1 className="text-4xl lg:text-6xl font-light text-foreground mb-8">
                <span className="bg-gradient-to-r from-[var(--mauve)] via-[var(--blue)] to-[var(--peach)] bg-clip-text text-transparent">
                  Loading Invoice
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Please wait while we fetch your invoice details...
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--mauve)]/5 via-[var(--blue)]/5 to-[var(--peach)]/5"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InZhcig--bWF1dmUpIiBmaWxsLW9wYWNpdHk9IjAuMDMiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl mb-8 group">
                <FileText className="h-10 w-10 text-red-500" />
              </div>
              <h1 className="text-4xl lg:text-6xl font-light text-foreground mb-8">
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Invoice Not Found
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
                The invoice you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-[var(--blue)] to-[var(--mauve)] hover:from-[var(--blue)]/90 hover:to-[var(--mauve)]/90">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go back to home
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "overdue":
        return "destructive"
      case "draft":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--mauve)]/8 via-[var(--blue)]/8 to-[var(--peach)]/8"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InZhcig--bWF1dmUpIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[var(--mauve)]/15 to-[var(--pink)]/15 rounded-3xl mb-8 group hover:scale-110 transition-all duration-500 shadow-lg shadow-[var(--mauve)]/10">
              <FileText className="h-12 w-12 text-[var(--mauve)] group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-light text-foreground mb-8 group">
              <span className="bg-gradient-to-r from-[var(--mauve)] via-[var(--blue)] to-[var(--peach)] bg-clip-text text-transparent transition-all duration-700 drop-shadow-sm">
                {invoice.invoiceNumber}
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Professional invoice from {invoice.company?.name || "Your Company"}
            </p>
          </div>
        </div>
      </section>

      {/* Action Bar */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" className="h-12 px-6 border-2 border-border hover:border-[var(--mauve)]/50 hover:text-[var(--mauve)] hover:bg-gradient-to-r hover:from-[var(--mauve)]/10 hover:to-[var(--mauve)]/5 transition-all duration-300 shadow-sm hover:shadow-md">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Button asChild variant="outline" className="h-12 px-6 border-2 border-border hover:border-[var(--mauve)]/50 hover:text-[var(--mauve)] hover:bg-gradient-to-r hover:from-[var(--mauve)]/10 hover:to-[var(--mauve)]/5 transition-all duration-300 shadow-sm hover:shadow-md">
                <Link href={`/api/invoices/public/${invoice.publicSlug}/pdf?style=bw`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download B&W PDF
                </Link>
              </Button>
              <Button asChild className="h-12 px-6 bg-gradient-to-r from-[var(--blue)] to-[var(--blue)]/90 hover:from-[var(--blue)]/90 hover:to-[var(--blue)]/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                <Link href={`/api/invoices/public/${invoice.publicSlug}/pdf?style=color`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Color PDF
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {invoice.invoiceNumber && (
            <Card className="hover:shadow-xl hover:shadow-[var(--blue)]/10 transition-all duration-300 bg-gradient-to-br from-[var(--blue)]/5 to-transparent hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                    <p className="text-2xl font-bold text-foreground">{invoice.invoiceNumber}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--blue)]/15 to-[var(--blue)]/5 shadow-lg shadow-[var(--blue)]/10">
                    <FileText className="h-7 w-7 text-[var(--blue)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {invoice.issueDate && (
            <Card className="hover:shadow-xl hover:shadow-[var(--green)]/10 transition-all duration-300 bg-gradient-to-br from-[var(--green)]/5 to-transparent hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                    <p className="text-2xl font-bold text-foreground">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--green)]/15 to-[var(--green)]/5 shadow-lg shadow-[var(--green)]/10">
                    <Calendar className="h-7 w-7 text-[var(--green)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {invoice.dueDate && (
            <Card className="hover:shadow-xl hover:shadow-[var(--mauve)]/10 transition-all duration-300 bg-gradient-to-br from-[var(--mauve)]/5 to-transparent hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                    <p className="text-2xl font-bold text-foreground">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--mauve)]/15 to-[var(--mauve)]/5 shadow-lg shadow-[var(--mauve)]/10">
                    <Clock className="h-7 w-7 text-[var(--mauve)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {invoice.total && (
            <Card className="hover:shadow-xl hover:shadow-[var(--peach)]/10 transition-all duration-300 bg-gradient-to-br from-[var(--peach)]/5 to-transparent hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(invoice.total)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--peach)]/15 to-[var(--peach)]/5 shadow-lg shadow-[var(--peach)]/10">
                    <DollarSign className="h-7 w-7 text-[var(--peach)]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Invoice Card */}
        <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[var(--blue)]/5 to-transparent">
          <CardHeader className="pb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--blue)]/15 to-[var(--blue)]/5 shadow-lg shadow-[var(--blue)]/10">
                  <FileText className="h-10 w-10 text-[var(--blue)]" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-foreground">Invoice Details</CardTitle>
                  <CardDescription className="text-xl text-muted-foreground mt-2">
                    Complete invoice information and payment details
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={getStatusVariant(invoice.status)} className="px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  {invoice.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Company and Client Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-gradient-to-br from-[var(--blue)]/10 to-[var(--blue)]/5 border border-[var(--blue)]/20 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <div className="p-2.5 bg-gradient-to-br from-[var(--blue)]/20 to-[var(--blue)]/10 rounded-xl mr-3 shadow-sm">
                    <Building2 className="h-5 w-5 text-[var(--blue)]" />
                  </div>
                  From
                </h3>
                <div className="text-base text-muted-foreground space-y-2">
                  {invoice.company?.name && (
                    <p className="font-semibold text-foreground text-lg">{invoice.company.name}</p>
                  )}
                  {invoice.company?.email && (
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-[var(--blue)]" />
                      {invoice.company.email}
                    </p>
                  )}
                  {invoice.company?.phone && (
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-[var(--blue)]" />
                      {invoice.company.phone}
                    </p>
                  )}
                  {(invoice.company?.address || invoice.company?.city || invoice.company?.state || invoice.company?.country) && (
                    <div className="mt-3 flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-[var(--blue)] mt-1" />
                      <div>
                        {invoice.company?.address && <p>{invoice.company.address}</p>}
                        {(invoice.company?.city || invoice.company?.state) && (
                          <p>
                            {invoice.company?.city && invoice.company?.state 
                              ? `${invoice.company.city}, ${invoice.company.state} ${invoice.company.zipCode || ""}`.trim()
                              : invoice.company?.city || invoice.company?.state || ""
                            }
                          </p>
                        )}
                        {invoice.company?.country && <p>{invoice.company.country}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-[var(--green)]/10 to-[var(--green)]/5 border border-[var(--green)]/20 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <div className="p-2.5 bg-gradient-to-br from-[var(--green)]/20 to-[var(--green)]/10 rounded-xl mr-3 shadow-sm">
                    <Building2 className="h-5 w-5 text-[var(--green)]" />
                  </div>
                  Bill To
                </h3>
                <div className="text-base text-muted-foreground space-y-2">
                  {invoice.client.name && (
                    <p className="font-semibold text-foreground text-lg">{invoice.client.name}</p>
                  )}
                  {invoice.client.email && (
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-[var(--green)]" />
                      {invoice.client.email}
                    </p>
                  )}
                  {invoice.client.phone && (
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-[var(--green)]" />
                      {invoice.client.phone}
                    </p>
                  )}
                  {(invoice.client.address || invoice.client.city || invoice.client.state || invoice.client.country) && (
                    <div className="mt-3 flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-[var(--green)] mt-1" />
                      <div>
                        {invoice.client.address && <p>{invoice.client.address}</p>}
                        {(invoice.client.city || invoice.client.state) && (
                          <p>
                            {invoice.client.city && invoice.client.state 
                              ? `${invoice.client.city}, ${invoice.client.state} ${invoice.client.zipCode || ""}`.trim()
                              : invoice.client.city || invoice.client.state || ""
                            }
                          </p>
                        )}
                        {invoice.client.country && <p>{invoice.client.country}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(invoice.items && invoice.items.length > 0) || (invoice.subtotal || invoice.total) ? (
              <Separator />
            ) : null}

            {/* Invoice Items */}
            {invoice.items && invoice.items.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                  <div className="p-2.5 bg-gradient-to-br from-[var(--mauve)]/20 to-[var(--mauve)]/10 rounded-xl mr-3 shadow-sm">
                    <BarChart3 className="h-5 w-5 text-[var(--mauve)]" />
                  </div>
                  Invoice Items
                </h3>
                <div className="border-2 border-border rounded-xl overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-[var(--mauve)]/10 to-[var(--mauve)]/5 border-b-2 border-[var(--mauve)]/20">
                        <TableHead className="font-bold text-foreground py-4">Description</TableHead>
                        <TableHead className="w-24 text-center font-bold text-foreground py-4">Qty</TableHead>
                        <TableHead className="w-32 text-right font-bold text-foreground py-4">Unit Price</TableHead>
                        <TableHead className="w-32 text-right font-bold text-foreground py-4">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.items.map((item, index) => (
                        <TableRow key={item.id} className="hover:bg-gradient-to-r hover:from-[var(--mauve)]/5 hover:to-transparent transition-all duration-300 group">
                          <TableCell className="font-semibold py-4">{item.description}</TableCell>
                          <TableCell className="text-center py-4">{formatQuantity(item.quantity)}</TableCell>
                          <TableCell className="text-right py-4">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right py-4 font-bold">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Totals */}
            {(invoice.subtotal || invoice.total) && (
              <div className="p-6 rounded-xl bg-gradient-to-br from-[var(--mauve)]/10 to-[var(--mauve)]/5 border border-[var(--mauve)]/20 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                  <div className="p-2.5 bg-gradient-to-br from-[var(--mauve)]/20 to-[var(--mauve)]/10 rounded-xl mr-3 shadow-sm">
                    <DollarSign className="h-5 w-5 text-[var(--mauve)]" />
                  </div>
                  Invoice Summary
                </h3>
                <div className="space-y-4">
                  {invoice.subtotal && (
                    <div className="flex justify-between py-3 border-b border-[var(--mauve)]/20">
                      <span className="text-base font-medium text-muted-foreground">Subtotal</span>
                      <span className="text-lg font-bold text-foreground">{formatCurrency(invoice.subtotal)}</span>
                    </div>
                  )}
                  {invoice.discountAmount > 0 && (
                    <div className="flex justify-between py-3 border-b border-[var(--mauve)]/20">
                      <span className="text-base font-medium text-muted-foreground">
                        Discount {invoice.discountType === "PERCENTAGE" ? `(${invoice.discountValue}%)` : `(${formatCurrency(invoice.discountValue)})`}
                      </span>
                      <span className="text-lg font-bold text-[var(--red)]">-{formatCurrency(invoice.discountAmount)}</span>
                    </div>
                  )}
                  {invoice.discountAmount > 0 && invoice.subtotal && (
                    <div className="flex justify-between py-3 border-b border-[var(--mauve)]/20">
                      <span className="text-base font-medium text-muted-foreground">Subtotal after discount</span>
                      <span className="text-lg font-bold text-foreground">{formatCurrency(Number(invoice.subtotal) - Number(invoice.discountAmount))}</span>
                    </div>
                  )}
                  {invoice.taxAmount > 0 && (
                    <div className="flex justify-between py-3 border-b border-[var(--mauve)]/20">
                      <span className="text-base font-medium text-muted-foreground">Tax ({invoice.taxRate}%)</span>
                      <span className="text-lg font-bold text-foreground">{formatCurrency(invoice.taxAmount)}</span>
                    </div>
                  )}
                  {invoice.total && (
                    <div className="flex justify-between py-4 bg-gradient-to-r from-[var(--mauve)]/15 to-[var(--blue)]/15 rounded-lg px-6 border-2 border-[var(--mauve)]/30">
                      <span className="text-xl font-bold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-[var(--mauve)]">{formatCurrency(invoice.total)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {invoice.notes && (
              <div className="p-6 rounded-xl bg-gradient-to-br from-[var(--peach)]/10 to-[var(--peach)]/5 border border-[var(--peach)]/20 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <div className="p-2.5 bg-gradient-to-br from-[var(--peach)]/20 to-[var(--peach)]/10 rounded-xl mr-3 shadow-sm">
                    <FileText className="h-5 w-5 text-[var(--peach)]" />
                  </div>
                  Additional Notes
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  )
}
