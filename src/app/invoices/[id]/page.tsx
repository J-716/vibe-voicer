"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Edit, ArrowLeft, Download, Send, Eye, Copy, FileText, Building2, Mail, Phone, MapPin, DollarSign, Calendar, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice not found</h1>
            <p className="text-gray-600 mb-4">The invoice you're looking for doesn't exist.</p>
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
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/invoices">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Invoices
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{invoice.invoiceNumber}</h1>
                <p className="text-gray-600">Invoice details and management</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge variant={getStatusVariant(invoice.status)} className="text-sm font-medium">
                {invoice.status}
              </Badge>
              <Button variant="outline" asChild className="hover:bg-gray-50">
                <Link href={`/invoices/${invoiceId}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button variant="outline" onClick={copyPublicLink} className="hover:bg-gray-50">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" asChild className="hover:bg-gray-50">
                <Link href={`/i/${invoice.publicSlug}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href={`/api/invoices/${invoiceId}/pdf`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="text-lg font-bold text-gray-900">${Number(invoice.total).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Issue Date</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Calendar className="h-6 w-6 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Due Date</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Items</p>
                    <p className="text-lg font-bold text-gray-900">{invoice.items.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Client Information */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Bill To</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{invoice.client.name}</p>
                  <p>{invoice.client.email}</p>
                  <p>{invoice.client.phone}</p>
                  <div className="mt-1">
                    <p>{invoice.client.address}</p>
                    <p>{invoice.client.city}, {invoice.client.state} {invoice.client.zipCode}</p>
                    <p>{invoice.client.country}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Invoice Items */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-24 text-right">Qty</TableHead>
                      <TableHead className="w-32 text-right">Unit Price</TableHead>
                      <TableHead className="w-32 text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${Number(item.unitPrice).toFixed(2)}</TableCell>
                        <TableCell className="text-right">${Number(item.total).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="font-medium">${Number(invoice.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax ({invoice.taxRate}%)</span>
                  <span className="font-medium">${Number(invoice.taxAmount).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">${Number(invoice.total).toFixed(2)}</span>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-600">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Manage this invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href={`/invoices/${invoiceId}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Invoice
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Send className="mr-2 h-4 w-4" />
                Send Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={copyPublicLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Public Link
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/i/${invoice.publicSlug}`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Public Page
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/api/invoices/${invoiceId}/pdf`}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  )
}
