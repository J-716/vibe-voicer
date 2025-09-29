"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { FileText, Users, DollarSign, TrendingUp, Plus, Calendar, BarChart3, Activity, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { formatCurrency } from "@/lib/utils"

export default function DashboardPage() {
  const { data: session } = useSession()

  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalClients: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
  })
  const [recentInvoices, setRecentInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch invoices and clients in parallel
        const [invoicesResponse, clientsResponse] = await Promise.all([
          fetch("/api/invoices", { credentials: "include" }),
          fetch("/api/clients", { credentials: "include" })
        ])

        if (!invoicesResponse.ok || !clientsResponse.ok) {
          throw new Error("Failed to fetch dashboard data")
        }

        const invoices = await invoicesResponse.json()
        const clients = await clientsResponse.json()

        // Calculate stats
        const totalInvoices = invoices.length
        const totalClients = clients.length
        const totalRevenue = Number(invoices.reduce((sum: number, invoice: any) => sum + Number(invoice.total), 0))
        const pendingInvoices = invoices.filter((invoice: any) => invoice.status === "PENDING" || invoice.status === "SENT").length

        setStats({
          totalInvoices,
          totalClients,
          totalRevenue,
          pendingInvoices,
        })

        // Get recent invoices (last 5)
        const recent = invoices
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map((invoice: any) => ({
            id: invoice.id,
            client: invoice.client.name,
            amount: Number(invoice.total),
            status: invoice.status,
            dueDate: new Date(invoice.dueDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
          }))

        setRecentInvoices(recent)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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
                Welcome Back
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Here's what's happening with your business today, {session?.user?.name || "User"}
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-xl hover:shadow-[var(--blue)]/10 transition-all duration-300 border-l-4 border-l-[var(--blue)] bg-gradient-to-br from-[var(--blue)]/5 to-transparent hover:-translate-y-1">
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--blue)]/15 to-[var(--blue)]/5 shadow-lg shadow-[var(--blue)]/10">
                    <FileText className="h-7 w-7 text-[var(--blue)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalInvoices}</p>
                  </div>
                </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl hover:shadow-[var(--green)]/10 transition-all duration-300 border-l-4 border-l-[var(--green)] bg-gradient-to-br from-[var(--green)]/5 to-transparent hover:-translate-y-1">
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--green)]/15 to-[var(--green)]/5 shadow-lg shadow-[var(--green)]/10">
                    <Users className="h-7 w-7 text-[var(--green)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalClients}</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl hover:shadow-[var(--peach)]/10 transition-all duration-300 border-l-4 border-l-[var(--peach)] bg-gradient-to-br from-[var(--peach)]/5 to-transparent hover:-translate-y-1">
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--peach)]/15 to-[var(--peach)]/5 shadow-lg shadow-[var(--peach)]/10">
                    <Clock className="h-7 w-7 text-[var(--peach)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Invoices</p>
                    <p className="text-2xl font-bold text-foreground">{stats.pendingInvoices}</p>
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[var(--blue)]/5 to-transparent border-l-4 border-l-[var(--blue)]">
            <CardHeader className="pb-6">
              <CardTitle className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--blue)]/15 to-[var(--blue)]/5 shadow-lg shadow-[var(--blue)]/10">
                    <BarChart3 className="h-6 w-6 text-[var(--blue)]" />
                  </div>
                  <span className="text-xl font-bold">Recent Invoices</span>
                </div>
              </CardTitle>
              <CardDescription className="text-center text-base">
                Your latest invoice activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentInvoices.length > 0 ? (
                recentInvoices.map((invoice, index) => {
                  const colors = [
                    { bg: 'bg-[var(--blue)]/5', text: 'text-[var(--blue)]', border: 'border-[var(--blue)]/20', hover: 'hover:bg-[var(--blue)]/10' },
                    { bg: 'bg-[var(--green)]/5', text: 'text-[var(--green)]', border: 'border-[var(--green)]/20', hover: 'hover:bg-[var(--green)]/10' },
                    { bg: 'bg-[var(--mauve)]/5', text: 'text-[var(--mauve)]', border: 'border-[var(--mauve)]/20', hover: 'hover:bg-[var(--mauve)]/10' },
                    { bg: 'bg-[var(--peach)]/5', text: 'text-[var(--peach)]', border: 'border-[var(--peach)]/20', hover: 'hover:bg-[var(--peach)]/10' },
                    { bg: 'bg-[var(--pink)]/5', text: 'text-[var(--pink)]', border: 'border-[var(--pink)]/20', hover: 'hover:bg-[var(--pink)]/10' }
                  ];
                  const colorScheme = colors[index % colors.length];
                  
                  return (
                    <Link key={invoice.id} href={`/invoices/${invoice.id}`} className="block group">
                      <div className={`p-4 rounded-xl ${colorScheme.bg} border ${colorScheme.border} ${colorScheme.hover} transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2.5 ${colorScheme.bg.replace('/5', '/15')} rounded-xl shadow-sm`}>
                              <FileText className={`h-5 w-5 ${colorScheme.text}`} />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground group-hover:text-[var(--blue)] transition-colors">{invoice.client}</p>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Due {invoice.dueDate}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-foreground group-hover:text-[var(--blue)] transition-colors">{formatCurrency(invoice.amount)}</p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              invoice.status === "PAID" ? "bg-[var(--green)]/15 text-[var(--green)] shadow-sm shadow-[var(--green)]/10" :
                              invoice.status === "PENDING" ? "bg-[var(--yellow)]/15 text-[var(--yellow)] shadow-sm shadow-[var(--yellow)]/10" :
                              invoice.status === "SENT" ? "bg-[var(--sky)]/15 text-[var(--sky)] shadow-sm shadow-[var(--sky)]/10" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {invoice.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-muted-foreground">No invoices yet</p>
                  <p className="text-sm text-muted-foreground/70">Create your first invoice to get started</p>
                </div>
              )}
              <div className="mt-4 flex justify-center">
                <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--sky)]/5 to-[var(--blue)]/5 border border-[var(--sky)]/20 hover:bg-gradient-to-r hover:from-[var(--sky)]/10 hover:to-[var(--blue)]/10 transition-all duration-300 shadow-sm hover:shadow-md group">
                  <Button asChild variant="ghost" className="w-full justify-center h-auto p-0 hover:bg-transparent">
                    <Link href="/invoices" className="flex items-center justify-center w-full group">
                      <div className="p-2.5 bg-gradient-to-br from-[var(--sky)]/20 to-[var(--blue)]/20 rounded-xl mr-4 group-hover:from-[var(--sky)]/30 group-hover:to-[var(--blue)]/30 transition-all duration-300">
                        <FileText className="h-5 w-5 text-[var(--sky)] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-foreground text-base group-hover:text-[var(--sky)] transition-colors duration-300">View All Invoices</p>
                        <p className="text-sm text-muted-foreground group-hover:text-[var(--sky)]/80 transition-colors duration-300">Manage your complete invoice list</p>
                      </div>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[var(--peach)]/5 to-transparent border-l-4 border-l-[var(--peach)]">
            <CardHeader className="pb-6">
              <CardTitle className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--peach)]/15 to-[var(--peach)]/5 shadow-lg shadow-[var(--peach)]/10">
                    <Activity className="h-6 w-6 text-[var(--peach)]" />
                  </div>
                  <span className="text-xl font-bold">Quick Actions</span>
                </div>
              </CardTitle>
              <CardDescription className="text-center text-base">
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--blue)]/10 to-[var(--blue)]/5 border border-[var(--blue)]/20 hover:bg-gradient-to-r hover:from-[var(--blue)]/15 hover:to-[var(--blue)]/10 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group">
                <Button asChild variant="ghost" className="w-full justify-start h-auto p-0 hover:bg-transparent">
                  <Link href="/invoices/new" className="flex items-center w-full group">
                    <div className="p-2.5 bg-gradient-to-br from-[var(--blue)]/20 to-[var(--blue)]/10 rounded-xl mr-4 shadow-sm group-hover:shadow-md transition-all duration-300">
                      <Plus className="h-5 w-5 text-[var(--blue)]" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground group-hover:text-[var(--blue)] transition-colors">Create New Invoice</p>
                      <p className="text-sm text-muted-foreground">Start billing your clients</p>
                    </div>
                  </Link>
                </Button>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--green)]/10 to-[var(--green)]/5 border border-[var(--green)]/20 hover:bg-gradient-to-r hover:from-[var(--green)]/15 hover:to-[var(--green)]/10 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group">
                <Button asChild variant="ghost" className="w-full justify-start h-auto p-0 hover:bg-transparent">
                  <Link href="/clients/new" className="flex items-center w-full group">
                    <div className="p-2.5 bg-gradient-to-br from-[var(--green)]/20 to-[var(--green)]/10 rounded-xl mr-4 shadow-sm group-hover:shadow-md transition-all duration-300">
                      <Users className="h-5 w-5 text-[var(--green)]" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground group-hover:text-[var(--green)] transition-colors">Add New Client</p>
                      <p className="text-sm text-muted-foreground">Expand your customer base</p>
                    </div>
                  </Link>
                </Button>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--mauve)]/10 to-[var(--mauve)]/5 border border-[var(--mauve)]/20 hover:bg-gradient-to-r hover:from-[var(--mauve)]/15 hover:to-[var(--mauve)]/10 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group">
                <Button asChild variant="ghost" className="w-full justify-start h-auto p-0 hover:bg-transparent">
                  <Link href="/settings" className="flex items-center w-full group">
                    <div className="p-2.5 bg-gradient-to-br from-[var(--mauve)]/20 to-[var(--mauve)]/10 rounded-xl mr-4 shadow-sm group-hover:shadow-md transition-all duration-300">
                      <TrendingUp className="h-5 w-5 text-[var(--mauve)]" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground group-hover:text-[var(--mauve)] transition-colors">Update Settings</p>
                      <p className="text-sm text-muted-foreground">Customize your preferences</p>
                    </div>
                  </Link>
                </Button>
              </div>
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
