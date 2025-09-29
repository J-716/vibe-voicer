"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Users, Building2, Mail, Phone, MapPin, FileText, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  city: string
  state: string
  invoiceCount: number
  totalValue: number
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch clients from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/clients", {
          credentials: "include"
        })
        if (!response.ok) {
          throw new Error("Failed to fetch clients")
        }
        const data = await response.json()
        setClients(data)
      } catch (error) {
        console.error("Error fetching clients:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ProtectedLayout>
    )
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
              <Users className="h-12 w-12 text-[var(--mauve)] group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-light text-foreground mb-8 group">
              <span className="bg-gradient-to-r from-[var(--mauve)] via-[var(--blue)] to-[var(--peach)] bg-clip-text text-transparent transition-all duration-700 drop-shadow-sm">
                Clients
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Manage your client relationships and track their activity
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-8">

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl hover:shadow-[var(--green)]/10 transition-all duration-300 border-l-4 border-l-[var(--green)] bg-gradient-to-br from-[var(--green)]/5 to-transparent hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--green)]/15 to-[var(--green)]/5 shadow-lg shadow-[var(--green)]/10">
                    <Users className="h-7 w-7 text-[var(--green)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                    <p className="text-2xl font-bold text-foreground">{clients.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl hover:shadow-[var(--blue)]/10 transition-all duration-300 border-l-4 border-l-[var(--blue)] bg-gradient-to-br from-[var(--blue)]/5 to-transparent hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--blue)]/15 to-[var(--blue)]/5 shadow-lg shadow-[var(--blue)]/10">
                    <FileText className="h-7 w-7 text-[var(--blue)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                    <p className="text-2xl font-bold text-foreground">
                      {clients.reduce((sum, client) => sum + (client.invoiceCount || 0), 0)}
                    </p>
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
                    <p className="text-2xl font-bold text-foreground">
                      ${clients.reduce((sum, client) => sum + (client.totalValue || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[var(--blue)]/5 to-transparent border-l-4 border-l-[var(--blue)]">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--blue)]/15 to-[var(--blue)]/5 shadow-lg shadow-[var(--blue)]/10">
                <Building2 className="h-6 w-6 text-[var(--blue)]" />
              </div>
              <span className="text-xl font-bold">All Clients</span>
            </CardTitle>
            <CardDescription className="text-base">
              A comprehensive list of all your clients and their information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    placeholder="Search clients by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 border-border hover:border-[var(--blue)]/50 focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/20 transition-all duration-200"
                  />
                </div>
                <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                  {filteredClients.length} of {clients.length} clients
                </div>
              </div>
              <Button asChild className="bg-gradient-to-r from-[var(--green)] to-[var(--green)]/90 hover:from-[var(--green)]/90 hover:to-[var(--green)]/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                <Link href="/clients/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Client
                </Link>
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[var(--blue)]/10 to-[var(--blue)]/5 border-b-2 border-[var(--blue)]/20">
                  <TableHead className="font-bold text-foreground py-4">Client</TableHead>
                  <TableHead className="font-bold text-foreground py-4">Contact</TableHead>
                  <TableHead className="font-bold text-foreground py-4">Location</TableHead>
                  <TableHead className="font-bold text-foreground py-4">Invoices</TableHead>
                  <TableHead className="font-bold text-foreground py-4">Total Value</TableHead>
                  <TableHead className="text-right font-bold text-foreground py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-gradient-to-r hover:from-[var(--blue)]/5 hover:to-transparent transition-all duration-300 group">
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-2.5 bg-gradient-to-br from-[var(--blue)]/15 to-[var(--blue)]/5 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300">
                            <Building2 className="h-5 w-5 text-[var(--blue)]" />
                          </div>
                          <div>
                            <Link 
                              href={`/clients/${client.id}`}
                              className="font-semibold text-foreground hover:text-[var(--blue)] hover:underline transition-colors group-hover:text-[var(--blue)]"
                            >
                              {client.name}
                            </Link>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          {client.email && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground/60" />
                              <span className="text-foreground">{client.email}</span>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground/60" />
                              <span className="text-muted-foreground">{client.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {(client.city || client.state) ? (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 text-muted-foreground/60" />
                            <span>
                              {[client.city, client.state].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground/60">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground/60" />
                          <Badge variant="secondary" className="bg-gradient-to-r from-[var(--blue)]/15 to-[var(--blue)]/5 text-[var(--blue)] border-[var(--blue)]/20 shadow-sm">
                            {client.invoiceCount || 0}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-[var(--green)]" />
                          <span className="font-bold text-foreground">
                            ${(client.totalValue || 0).toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" asChild className="hover:bg-gradient-to-r hover:from-[var(--blue)]/10 hover:to-[var(--blue)]/5 hover:text-[var(--blue)] transition-all duration-300 shadow-sm hover:shadow-md">
                            <Link href={`/clients/${client.id}`} title="View Client">
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-[var(--red)]/10 hover:to-[var(--red)]/5 hover:text-[var(--red)] transition-all duration-300 shadow-sm hover:shadow-md" title="Delete Client">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center space-y-6">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--blue)]/10 to-[var(--blue)]/5 shadow-lg shadow-[var(--blue)]/10">
                          <Users className="h-16 w-16 text-[var(--blue)]/60" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-foreground mb-2">No clients found</p>
                          <p className="text-muted-foreground">
                            {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first client"}
                          </p>
                        </div>
                        {!searchTerm && (
                          <Button asChild className="bg-gradient-to-r from-[var(--green)] to-[var(--green)]/90 hover:from-[var(--green)]/90 hover:to-[var(--green)]/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                            <Link href="/clients/new">
                              <Plus className="mr-2 h-4 w-4" />
                              Add First Client
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
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
