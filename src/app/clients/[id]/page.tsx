"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, ArrowLeft, Mail, Phone, MapPin, FileText, Plus, Building2, DollarSign, Calendar, BarChart3, Activity, Clock } from "lucide-react"
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
  subtotal: number
  discountType: string
  discountValue: number
  discountAmount: number
  taxRate: number
  taxAmount: number
  total: number
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Client not found</h1>
            <p className="text-muted-foreground mb-4">The client you're looking for doesn't exist.</p>
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
                <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
                <p className="text-muted-foreground">Client details and invoice history</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button asChild>
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
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                    <p className="text-lg font-bold text-foreground">{client.invoiceCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                    <p className="text-lg font-bold text-foreground">${client.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Activity className="h-6 w-6 text-success" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Paid</p>
                    <p className="text-lg font-bold text-foreground">${client.paidValue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Clock className="h-6 w-6 text-warning" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-lg font-bold text-foreground">${client.pendingValue.toLocaleString()}</p>
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
                  <Building2 className="h-5 w-5 text-primary" />
                  <span>Contact Information</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">{client.email || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Phone className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">{client.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="p-2 bg-info/10 rounded-lg mt-0.5">
                  <MapPin className="h-4 w-4 text-info" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Address</p>
                  <p className="text-sm text-muted-foreground">
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
                  <BarChart3 className="h-5 w-5 text-success" />
                  <span>Statistics</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium text-muted-foreground">Total Invoices</span>
                <span className="font-bold text-foreground">{client.invoiceCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium text-muted-foreground">Total Value</span>
                <span className="font-bold text-foreground">${client.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-success/10">
                <span className="text-sm font-medium text-success">Paid</span>
                <span className="font-bold text-success">${client.paidValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-warning/10">
                <span className="text-sm font-medium text-warning">Pending</span>
                <span className="font-bold text-warning">${client.pendingValue.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-info" />
                  <span>Quick Actions</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href="/invoices/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invoice
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/clients`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Back to Clients
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
                <FileText className="h-5 w-5 text-primary" />
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
                <TableRow className="bg-muted/50">
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
                    <TableRow key={invoice.id} className="hover:bg-accent/50 transition-colors">
                      <TableCell className="font-medium">
                        <Link 
                          href={`/invoices/${invoice.id}`}
                          className="text-primary hover:text-primary/80 hover:underline"
                        >
                          {invoice.invoiceNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{invoice.issueDate}</TableCell>
                      <TableCell className="text-muted-foreground">{invoice.dueDate}</TableCell>
                      <TableCell className="font-semibold text-foreground">${invoice.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            invoice.status === "PAID" ? "default" :
                            invoice.status === "PENDING" ? "secondary" :
                            invoice.status === "SENT" ? "outline" :
                            "destructive"
                          }
                          className={
                            invoice.status === "PAID" ? "bg-success/10 text-success" :
                            invoice.status === "PENDING" ? "bg-warning/10 text-warning" :
                            invoice.status === "SENT" ? "bg-info/10 text-info" :
                            "bg-destructive/10 text-destructive"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild className="hover:bg-[var(--green)]/10 hover:text-[var(--green)]">
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
                        <FileText className="h-12 w-12 text-muted-foreground/40" />
                        <div>
                          <p className="text-muted-foreground font-medium">No invoices yet</p>
                          <p className="text-sm text-muted-foreground/60">Create the first invoice for this client</p>
                        </div>
                        <Button asChild>
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
