"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Eye, Edit, Trash2, Download, Filter, Calendar, DollarSign, FileText, Building2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "sonner"

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "✓"
      case "pending":
        return "⏳"
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
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
              <p className="text-gray-600">Manage your invoices and billing</p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/invoices/new">
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                    <p className="text-lg font-bold text-gray-900">{totalInvoices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-lg font-bold text-gray-900">${totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Paid</p>
                    <p className="text-lg font-bold text-gray-900">{paidInvoices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-600 text-sm font-bold">⏳</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-lg font-bold text-gray-900">{pendingInvoices}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-center text-center space-y-2">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>All Invoices</span>
              </div>
            </CardTitle>
            <CardDescription className="text-center">
              A list of all your invoices and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
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
              </div>
              <div className="text-sm text-gray-500">
                {filteredInvoices.length} of {totalInvoices} invoices
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                    <TableRow key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">
                        <Link
                          href={`/invoices/${invoice.id}`}
                          className="hover:underline text-blue-600 hover:text-blue-800"
                        >
                          {invoice.invoiceNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">{invoice.client.name}</TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        ${Number(invoice.total).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(invoice.status)} className="flex items-center space-x-1">
                          <span>{getStatusIcon(invoice.status)}</span>
                          <span>{invoice.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Link href={`/i/${invoice.publicSlug}`} target="_blank" title="View Public Invoice">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="hover:bg-green-50 hover:text-green-600"
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
                            className="hover:bg-purple-50 hover:text-purple-600"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            disabled={deletingId === invoice.id}
                            className="hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
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
    </ProtectedLayout>
  )
}
