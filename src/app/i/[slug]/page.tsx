"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Download, ArrowLeft, FileText, Building2, Mail, Phone, MapPin, DollarSign, Calendar, BarChart3 } from "lucide-react"
import { processPaymentTerms } from "@/lib/payment-terms"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice not found</h1>
          <p className="text-gray-600 mb-4">The invoice you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back to home
          </Link>
        </div>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold">Invoice {invoice.invoiceNumber}</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Issued on {new Date(invoice.issueDate).toLocaleDateString()}</span>
                    {invoice.dueDate && (
                      <>
                        <span>•</span>
                        <span>Due on {new Date(invoice.dueDate).toLocaleDateString()}</span>
                      </>
                    )}
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={getStatusVariant(invoice.status)} className="mb-2 text-sm font-medium">
                  {invoice.status}
                </Badge>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  <div className="text-2xl font-bold text-emerald-600">${Number(invoice.total).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Company and Client Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">From</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{invoice.company?.name || "Your Company"}</p>
                  {invoice.company?.email && <p>{invoice.company.email}</p>}
                  {invoice.company?.phone && <p>{invoice.company.phone}</p>}
                  {(invoice.company?.address || invoice.company?.city) && (
                    <div className="mt-1">
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
                  )}
                </div>
              </div>
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

            {/* Payment Actions */}
            <div className="flex justify-center pt-6">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href={`/api/invoices/public/${invoice.publicSlug}/pdf`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
