"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, ArrowLeft, Mail, Phone, MapPin, FileText, Plus, Building2, DollarSign, Calendar, BarChart3, Activity } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  createdAt: string
  invoiceCount: number
  totalValue: number
  paidValue: number
  pendingValue: number
}

interface ClientInvoice {
  id: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  amount: number
  status: string
}

export default function ClientDetailPage() {
  const params = useParams()
  const clientId = params.id as string
  const [client, setClient] = useState<Client | null>(null)
  const [clientInvoices, setClientInvoices] = useState<ClientInvoice[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch client and invoices from API
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true)
        const [clientResponse, invoicesResponse] = await Promise.all([
          fetch(`/api/clients/${clientId}`, { credentials: "include" }),
          fetch(`/api/invoices?clientId=${clientId}`, { credentials: "include" })
        ])

        if (clientResponse.ok) {
          const clientData = await clientResponse.json()
          setClient(clientData)
        }

        if (invoicesResponse.ok) {
          const invoicesData = await invoicesResponse.json()
          setClientInvoices(invoicesData)
        }
      } catch (error) {
        console.error("Error fetching client data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (clientId) {
      fetchClientData()
    }
  }, [clientId])

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </ProtectedLayout>
    )
  }

  if (!client) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Client not found</h1>
            <p className="text-gray-600 mb-4">The client you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/clients">Back to Clients</Link>
            </Button>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/clients">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Clients
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                <p className="text-gray-600">Client details and invoice history</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" asChild className="hover:bg-gray-50">
                <Link href={`/clients/${clientId}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/invoices/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                    <p className="text-lg font-bold text-gray-900">{client.invoiceCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-lg font-bold text-gray-900">${client.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Activity className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Paid</p>
                    <p className="text-lg font-bold text-gray-900">${client.paidValue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Calendar className="h-6 w-6 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-lg font-bold text-gray-900">${client.pendingValue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span>Contact Information</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{client.email || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{client.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-purple-100 rounded-lg mt-0.5">
                  <MapPin className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">
                    {client.address || "Not provided"}<br />
                    {client.city && client.state ? `${client.city}, ${client.state} ${client.zipCode || ""}`.trim() : "Not provided"}<br />
                    {client.country || "Not provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span>Statistics</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium text-gray-600">Total Invoices</span>
                <span className="font-bold text-gray-900">{client.invoiceCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium text-gray-600">Total Value</span>
                <span className="font-bold text-gray-900">${client.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
                <span className="text-sm font-medium text-green-700">Paid</span>
                <span className="font-bold text-green-800">${client.paidValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50">
                <span className="text-sm font-medium text-orange-700">Pending</span>
                <span className="font-bold text-orange-800">${client.pendingValue.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span>Quick Actions</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                <Link href="/invoices/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invoice
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start hover:bg-gray-50">
                <Link href={`/clients/${clientId}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Client
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Invoice History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-center text-center space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Invoice History</span>
              </div>
            </CardTitle>
            <CardDescription className="text-center">
              All invoices for this client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Invoice #</TableHead>
                  <TableHead className="font-semibold">Issue Date</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientInvoices.length > 0 ? (
                  clientInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">
                        <Link 
                          href={`/invoices/${invoice.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {invoice.invoiceNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-gray-600">{invoice.issueDate}</TableCell>
                      <TableCell className="text-gray-600">{invoice.dueDate}</TableCell>
                      <TableCell className="font-semibold text-gray-900">${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            invoice.status === "PAID" ? "default" :
                            invoice.status === "PENDING" ? "secondary" :
                            invoice.status === "SENT" ? "outline" :
                            "destructive"
                          }
                          className={
                            invoice.status === "PAID" ? "bg-green-100 text-green-800" :
                            invoice.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                            invoice.status === "SENT" ? "bg-blue-100 text-blue-800" :
                            "bg-red-100 text-red-800"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild className="hover:bg-blue-50 hover:text-blue-600">
                          <Link href={`/invoices/${invoice.id}`}>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-4">
                        <FileText className="h-12 w-12 text-gray-300" />
                        <div>
                          <p className="text-gray-500 font-medium">No invoices yet</p>
                          <p className="text-sm text-gray-400">Create the first invoice for this client</p>
                        </div>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                          <Link href="/invoices/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Create First Invoice
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
