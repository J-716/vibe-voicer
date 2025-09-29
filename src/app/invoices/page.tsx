"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Eye, Edit, Trash2, Download, Filter, Calendar, DollarSign, FileText, Building2, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Footer } from "@/components/footer"

interface Invoice {
  id: string
  invoiceNumber: string
  client: {
    name: string
  }
  issueDate: string
  dueDate: string
  total: number
  status: string
  publicSlug: string
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch invoices from API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/invoices", {
          credentials: "include"
        })
        if (!response.ok) {
          throw new Error("Failed to fetch invoices")
        }
        const data = await response.json()
        setInvoices(data)
      } catch (error) {
        console.error("Error fetching invoices:", error)
        toast.error("Failed to load invoices")
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" ||
      invoice.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

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

  const getStatusClassName = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-[var(--green)]/10 text-[var(--green)] border-[var(--green)]/20"
      case "pending":
        return "bg-[var(--yellow)]/10 text-[var(--yellow)] border-[var(--yellow)]/20"
      case "sent":
        return "bg-[var(--sky)]/10 text-[var(--sky)] border-[var(--sky)]/20"
      case "overdue":
        return "bg-[var(--red)]/10 text-[var(--red)] border-[var(--red)]/20"
      case "draft":
        return "bg-[var(--mauve)]/10 text-[var(--mauve)] border-[var(--mauve)]/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "✓"
      case "pending":
        return <Clock className="h-4 w-4" />
      case "overdue":
        return "⚠️"
      case "draft":
        return "📝"
      default:
        return "📄"
    }
  }

  // Calculate stats
  const totalInvoices = invoices.length
  const totalValue = invoices.reduce((sum, invoice) => sum + Number(invoice.total), 0)
  const paidInvoices = invoices.filter(invoice => invoice.status.toLowerCase() === "paid").length
  const pendingInvoices = invoices.filter(invoice => invoice.status.toLowerCase() === "pending").length

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) {
      return
    }

    try {
      setDeletingId(invoiceId)
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete invoice")
      }

      // Remove the invoice from the local state
      setInvoices(invoices.filter(invoice => invoice.id !== invoiceId))
      toast.success("Invoice deleted successfully")
    } catch (error) {
      console.error("Error deleting invoice:", error)
      toast.error("Failed to delete invoice")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <ProtectedLayout>
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
                Invoices
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Manage your invoices and billing
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-xl hover:shadow-[var(--blue)]/10 transition-all duration-300 border-l-4 border-l-[var(--blue)] bg-gradient-to-br from-[var(--blue)]/5 to-transparent hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--blue)]/15 to-[var(--blue)]/5 shadow-lg shadow-[var(--blue)]/10">
                    <FileText className="h-7 w-7 text-[var(--blue)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                    <p className="text-2xl font-bold text-foreground">{totalInvoices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl hover:shadow-[var(--mauve)]/10 transition-all duration-300 border-l-4 border-l-[var(--mauve)] bg-gradient-to-br from-[var(--mauve)]/5 to-transparent hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--mauve)]/15 to-[var(--mauve)]/5 shadow-lg shadow-[var(--mauve)]/10">
                    <DollarSign className="h-7 w-7 text-[var(--mauve)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl hover:shadow-[var(--green)]/10 transition-all duration-300 border-l-4 border-l-[var(--green)] bg-gradient-to-br from-[var(--green)]/5 to-transparent hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--green)]/15 to-[var(--green)]/5 shadow-lg shadow-[var(--green)]/10">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[var(--green)]/20 to-[var(--green)]/10 flex items-center justify-center shadow-sm">
                      <span className="text-[var(--green)] text-sm font-bold">✓</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Paid</p>
                    <p className="text-2xl font-bold text-foreground">{paidInvoices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl hover:shadow-[var(--peach)]/10 transition-all duration-300 border-l-4 border-l-[var(--peach)] bg-gradient-to-br from-[var(--peach)]/5 to-transparent hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--peach)]/15 to-[var(--peach)]/5 shadow-lg shadow-[var(--peach)]/10">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[var(--peach)]/20 to-[var(--peach)]/10 flex items-center justify-center shadow-sm">
                      <Clock className="h-4 w-4 text-[var(--peach)]" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-foreground">{pendingInvoices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        <Card className="border-l-4 border-l-[var(--blue)] shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[var(--blue)]/5 to-transparent">
          <CardHeader className="text-center pb-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--blue)]/15 to-[var(--blue)]/5 w-fit mx-auto mb-6 shadow-lg shadow-[var(--blue)]/10">
              <Building2 className="h-10 w-10 text-[var(--blue)]" />
            </div>
            <CardTitle className="text-3xl font-bold">
              All Invoices
            </CardTitle>
            <CardDescription className="text-xl">
              A list of all your invoices and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80 border-2 border-border hover:border-[var(--blue)]/50 focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/20 transition-all duration-200"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] border-2 border-border hover:border-[var(--mauve)]/50 focus:border-[var(--mauve)] focus:ring-2 focus:ring-[var(--mauve)]/20 transition-all duration-200">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                  {filteredInvoices.length} of {totalInvoices} invoices
                </div>
              </div>
              <Button asChild className="bg-gradient-to-r from-[var(--blue)] to-[var(--blue)]/90 hover:from-[var(--blue)]/90 hover:to-[var(--blue)]/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                <Link href="/invoices/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Invoice
                </Link>
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[var(--blue)]/10 to-[var(--blue)]/5 border-b-2 border-[var(--blue)]/20">
                  <TableHead className="font-bold text-foreground py-4">Invoice #</TableHead>
                  <TableHead className="font-bold text-foreground py-4">Client</TableHead>
                  <TableHead className="font-bold text-foreground py-4">Issue Date</TableHead>
                  <TableHead className="font-bold text-foreground py-4">Due Date</TableHead>
                  <TableHead className="font-bold text-foreground py-4">Amount</TableHead>
                  <TableHead className="font-bold text-foreground py-4">Status</TableHead>
                  <TableHead className="text-right font-bold text-foreground py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading invoices...
                    </TableCell>
                  </TableRow>
                ) : filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-gradient-to-r hover:from-[var(--blue)]/5 hover:to-transparent transition-all duration-300 group">
                      <TableCell className="py-4 font-semibold">
                        <Link
                          href={`/invoices/${invoice.id}`}
                          className="hover:underline text-foreground hover:text-[var(--blue)] transition-colors group-hover:text-[var(--blue)]"
                        >
                          {invoice.invoiceNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="py-4 font-semibold">{invoice.client.name}</TableCell>
                      <TableCell className="py-4 text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3 text-muted-foreground/60" />
                          <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3 text-muted-foreground/60" />
                          <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 font-bold text-foreground">
                        ${Number(invoice.total).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusClassName(invoice.status)}`}>
                          <span>{getStatusIcon(invoice.status)}</span>
                          <span>{invoice.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="hover:bg-gradient-to-r hover:from-[var(--blue)]/10 hover:to-[var(--blue)]/5 hover:text-[var(--blue)] transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <Link href={`/i/${invoice.publicSlug}`} target="_blank" title="View Public Invoice">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="hover:bg-gradient-to-r hover:from-[var(--green)]/10 hover:to-[var(--green)]/5 hover:text-[var(--green)] transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <Link href={`/invoices/${invoice.id}`} title="Edit Invoice">
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              try {
                                console.log('Starting PDF download for invoice:', invoice.id)
                                const response = await fetch(`/api/invoices/${invoice.id}/pdf`, {
                                  credentials: 'include',
                                })

                                console.log('PDF response status:', response.status)
                                console.log('PDF response headers:', Object.fromEntries(response.headers.entries()))

                                if (!response.ok) {
                                  const errorText = await response.text()
                                  console.error('PDF response error:', errorText)
                                  throw new Error(`Failed to download PDF: ${response.status} ${errorText}`)
                                }

                                const blob = await response.blob()
                                console.log('PDF blob size:', blob.size)

                                if (blob.size === 0) {
                                  throw new Error('PDF file is empty')
                                }

                                const url = window.URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.style.display = 'none'
                                a.href = url
                                a.download = `invoice-${invoice.invoiceNumber}.pdf`
                                document.body.appendChild(a)
                                a.click()
                                window.URL.revokeObjectURL(url)
                                document.body.removeChild(a)
                                toast.success('PDF downloaded successfully')
                              } catch (error) {
                                console.error('Error downloading PDF:', error)
                                const message = error instanceof Error ? error.message : String(error)
                                toast.error(`Failed to download PDF: ${message}`)
                              }
                            }}
                            className="hover:bg-gradient-to-r hover:from-[var(--sky)]/10 hover:to-[var(--sky)]/5 hover:text-[var(--sky)] transition-all duration-300 shadow-sm hover:shadow-md"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            disabled={deletingId === invoice.id}
                            className="hover:bg-gradient-to-r hover:from-[var(--red)]/10 hover:to-[var(--red)]/5 hover:text-[var(--red)] disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow-md"
                            title="Delete Invoice"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </ProtectedLayout>
  )
}
