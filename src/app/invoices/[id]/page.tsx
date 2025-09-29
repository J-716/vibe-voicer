"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Edit, ArrowLeft, Download, Send, Eye, Copy, FileText, Building2, Mail, Phone, MapPin, DollarSign, Calendar, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Footer } from "@/components/footer"
import { formatCurrency, formatQuantity } from "@/lib/utils"

interface Invoice {
  id: string
  invoiceNumber: string
  publicSlug: string
  status: string
  issueDate: string
  dueDate: string
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
  taxRate: number
  taxAmount: number
  total: number
  notes: string
  createdAt: string
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const invoiceId = params.id as string
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch invoice from API
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/invoices/${invoiceId}`, {
          credentials: "include"
        })
        if (!response.ok) {
          throw new Error("Failed to fetch invoice")
        }
        const data = await response.json()
        setInvoice(data)
      } catch (error) {
        console.error("Error fetching invoice:", error)
        toast.error("Failed to load invoice")
      } finally {
        setLoading(false)
      }
    }

    if (invoiceId) {
      fetchInvoice()
    }
  }, [invoiceId])

  const copyPublicLink = () => {
    if (!invoice) return
    const publicUrl = `${window.location.origin}/i/${invoice.publicSlug}`
    navigator.clipboard.writeText(publicUrl)
    toast.success("Public link copied to clipboard")
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading invoice...</p>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  if (!invoice) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Invoice not found</h1>
            <p className="text-muted-foreground mb-4">The invoice you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/invoices">Back to Invoices</Link>
            </Button>
          </div>
        </div>
      </ProtectedLayout>
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
    <ProtectedLayout>
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--blue)]/8 via-[var(--mauve)]/8 to-[var(--peach)]/8"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InZhcig--bWF1dmUpIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[var(--blue)]/15 to-[var(--mauve)]/15 rounded-3xl mb-8 group hover:scale-110 transition-all duration-500 shadow-lg shadow-[var(--blue)]/10">
              <FileText className="h-12 w-12 text-[var(--blue)] group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-light text-foreground mb-8 group">
              <span className="bg-gradient-to-r from-[var(--blue)] via-[var(--mauve)] to-[var(--peach)] bg-clip-text text-transparent transition-all duration-700 drop-shadow-sm">
                {invoice.invoiceNumber}
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Invoice details and management
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-8">
        {/* Back Button and Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="lg" asChild className="hover:bg-gradient-to-r hover:from-[var(--blue)]/10 hover:to-[var(--mauve)]/10 transition-all duration-300 shadow-sm hover:shadow-md">
            <Link href="/invoices">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Invoices
            </Link>
          </Button>
          <div className="flex space-x-3">
            <Badge variant={getStatusVariant(invoice.status)} className="text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
              {invoice.status}
            </Badge>
            <Button variant="outline" size="lg" asChild className="h-12 px-6 border-2 border-border hover:border-[var(--blue)]/50 hover:text-[var(--blue)] hover:bg-gradient-to-r hover:from-[var(--blue)]/10 hover:to-[var(--blue)]/5 transition-all duration-300 shadow-sm hover:shadow-md">
              <Link href={`/invoices/${invoiceId}/edit`}>
                <Edit className="h-5 w-5 mr-2" />
                Edit
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={copyPublicLink} className="h-12 px-6 border-2 border-border hover:border-[var(--mauve)]/50 hover:text-[var(--mauve)] hover:bg-gradient-to-r hover:from-[var(--mauve)]/10 hover:to-[var(--mauve)]/5 transition-all duration-300 shadow-sm hover:shadow-md">
              <Copy className="h-5 w-5 mr-2" />
              Copy Link
            </Button>
            <Button variant="outline" size="lg" asChild className="h-12 px-6 border-2 border-border hover:border-[var(--peach)]/50 hover:text-[var(--peach)] hover:bg-gradient-to-r hover:from-[var(--peach)]/10 hover:to-[var(--peach)]/5 transition-all duration-300 shadow-sm hover:shadow-md">
              <Link href={`/i/${invoice.publicSlug}`} target="_blank">
                <Eye className="h-5 w-5 mr-2" />
                Preview
              </Link>
            </Button>
            <Button size="lg" asChild className="h-12 px-6 bg-gradient-to-r from-[var(--blue)] to-[var(--blue)]/90 hover:from-[var(--blue)]/90 hover:to-[var(--blue)]/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              <Link href={`/api/invoices/${invoiceId}/pdf`}>
                <Download className="h-5 w-5 mr-2" />
                Download PDF
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-xl hover:shadow-[var(--green)]/10 transition-all duration-300 border-l-4 border-l-[var(--green)] bg-gradient-to-br from-[var(--green)]/5 to-transparent hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--green)]/15 to-[var(--green)]/5 shadow-lg shadow-[var(--green)]/10">
                  <DollarSign className="h-7 w-7 text-[var(--green)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(invoice.total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl hover:shadow-[var(--blue)]/10 transition-all duration-300 border-l-4 border-l-[var(--blue)] bg-gradient-to-br from-[var(--blue)]/5 to-transparent hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--blue)]/15 to-[var(--blue)]/5 shadow-lg shadow-[var(--blue)]/10">
                  <Calendar className="h-7 w-7 text-[var(--blue)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl hover:shadow-[var(--mauve)]/10 transition-all duration-300 border-l-4 border-l-[var(--mauve)] bg-gradient-to-br from-[var(--mauve)]/5 to-transparent hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--mauve)]/15 to-[var(--mauve)]/5 shadow-lg shadow-[var(--mauve)]/10">
                  <Calendar className="h-7 w-7 text-[var(--mauve)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl hover:shadow-[var(--peach)]/10 transition-all duration-300 border-l-4 border-l-[var(--peach)] bg-gradient-to-br from-[var(--peach)]/5 to-transparent hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--peach)]/15 to-[var(--peach)]/5 shadow-lg shadow-[var(--peach)]/10">
                  <BarChart3 className="h-7 w-7 text-[var(--peach)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Items</p>
                  <p className="text-2xl font-bold text-foreground">{invoice.items.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Details */}
          <Card className="lg:col-span-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[var(--blue)]/5 to-transparent">
            <CardHeader className="pb-8">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--blue)]/15 to-[var(--blue)]/5 shadow-lg shadow-[var(--blue)]/10">
                  <FileText className="h-6 w-6 text-[var(--blue)]" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Invoice Details</CardTitle>
                  <CardDescription className="text-base">Complete invoice information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Client Information */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Bill To</h3>
                <div className="text-base text-muted-foreground space-y-2">
                  <p className="font-semibold text-foreground">{invoice.client.name}</p>
                  <p>{invoice.client.email}</p>
                  <p>{invoice.client.phone}</p>
                  <div className="mt-3 space-y-1">
                    <p>{invoice.client.address}</p>
                    <p>{`${invoice.client.city}, ${invoice.client.state} ${invoice.client.zipCode}`}</p>
                    <p>{invoice.client.country}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Invoice Items */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-6">Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-[var(--blue)]/10 to-[var(--blue)]/5 border-b-2 border-[var(--blue)]/20">
                      <TableRow>
                        <TableHead className="font-bold text-foreground py-4">Description</TableHead>
                        <TableHead className="w-24 text-right font-bold text-foreground py-4">Qty</TableHead>
                        <TableHead className="w-32 text-right font-bold text-foreground py-4">Unit Price</TableHead>
                        <TableHead className="w-32 text-right font-bold text-foreground py-4">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.items.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gradient-to-r hover:from-[var(--blue)]/5 hover:to-transparent transition-all duration-300 group">
                          <TableCell className="font-semibold py-4">{item.description}</TableCell>
                          <TableCell className="text-right py-4">{formatQuantity(item.quantity)}</TableCell>
                          <TableCell className="text-right py-4">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right py-4 font-bold">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-4 bg-gradient-to-r from-[var(--green)]/5 to-[var(--green)]/10 p-6 rounded-xl">
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Tax ({invoice.taxRate}%)</span>
                  <span className="font-semibold">{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-xl">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-2xl text-[var(--green)]">{formatCurrency(invoice.total)}</span>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Notes</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-base text-muted-foreground">{invoice.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Actions */}
          <Card className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[var(--mauve)]/5 to-transparent">
            <CardHeader className="pb-8">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--mauve)]/15 to-[var(--mauve)]/5 shadow-lg shadow-[var(--mauve)]/10">
                  <Settings className="h-6 w-6 text-[var(--mauve)]" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Actions</CardTitle>
                  <CardDescription className="text-base">Manage this invoice</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full h-12 justify-start bg-gradient-to-r from-[var(--blue)] to-[var(--blue)]/90 hover:from-[var(--blue)]/90 hover:to-[var(--blue)]/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                <Link href={`/invoices/${invoiceId}/edit`}>
                  <Edit className="mr-3 h-5 w-5" />
                  Edit Invoice
                </Link>
              </Button>
              <Button variant="outline" className="w-full h-12 justify-start border-2 border-border hover:border-[var(--green)]/50 hover:text-[var(--green)] hover:bg-gradient-to-r hover:from-[var(--green)]/10 hover:to-[var(--green)]/5 transition-all duration-300 shadow-sm hover:shadow-md">
                <Send className="mr-3 h-5 w-5" />
                Send Invoice
              </Button>
              <Button variant="outline" className="w-full h-12 justify-start border-2 border-border hover:border-[var(--mauve)]/50 hover:text-[var(--mauve)] hover:bg-gradient-to-r hover:from-[var(--mauve)]/10 hover:to-[var(--mauve)]/5 transition-all duration-300 shadow-sm hover:shadow-md" onClick={copyPublicLink}>
                <Copy className="mr-3 h-5 w-5" />
                Copy Public Link
              </Button>
              <Button variant="outline" className="w-full h-12 justify-start border-2 border-border hover:border-[var(--peach)]/50 hover:text-[var(--peach)] hover:bg-gradient-to-r hover:from-[var(--peach)]/10 hover:to-[var(--peach)]/5 transition-all duration-300 shadow-sm hover:shadow-md" asChild>
                <Link href={`/i/${invoice.publicSlug}`} target="_blank">
                  <Eye className="mr-3 h-5 w-5" />
                  Preview Public Page
                </Link>
              </Button>
              <Button variant="outline" className="w-full h-12 justify-start border-2 border-border hover:border-[var(--sky)]/50 hover:text-[var(--sky)] hover:bg-gradient-to-r hover:from-[var(--sky)]/10 hover:to-[var(--sky)]/5 transition-all duration-300 shadow-sm hover:shadow-md" asChild>
                <Link href={`/api/invoices/${invoiceId}/pdf`}>
                  <Download className="mr-3 h-5 w-5" />
                  Download PDF
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </ProtectedLayout>
  )
}
