"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { FileText, Users, DollarSign, TrendingUp, Plus, Calendar, BarChart3, Activity } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

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
        const totalRevenue = Number(invoices.reduce((sum: number, invoice: any) => sum + Number(invoice.total), 0).toFixed(2))
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
            amount: Number(invoice.total).toFixed(2),
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
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session?.user?.name || "User"}!
              </h1>
              <p className="text-gray-600">Here's what's happening with your business today.</p>
            </div>
            <div className="flex space-x-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/invoices/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/clients/new">
                  <Users className="h-4 w-4 mr-2" />
                  Add Client
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-lg font-bold text-gray-900">{stats.totalInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <Users className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-lg font-bold text-gray-900">{stats.totalClients}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <DollarSign className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-lg font-bold text-gray-900">${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <Activity className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                  <p className="text-lg font-bold text-gray-900">{stats.pendingInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Recent Invoices</span>
                </div>
              </CardTitle>
              <CardDescription className="text-center">
                Your latest invoice activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInvoices.length > 0 ? (
                  recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{invoice.client}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due {invoice.dueDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${invoice.amount}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === "PAID" ? "bg-green-100 text-green-800" :
                          invoice.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                          invoice.status === "SENT" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No invoices yet</p>
                    <p className="text-sm text-gray-400">Create your first invoice to get started</p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/invoices">View all invoices</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col items-center text-center space-y-2">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span>Quick Actions</span>
                </div>
              </CardTitle>
              <CardDescription className="text-center">
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                <Link href="/invoices/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Invoice
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start hover:bg-gray-50">
                <Link href="/clients/new">
                  <Users className="mr-2 h-4 w-4" />
                  Add New Client
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start hover:bg-gray-50">
                <Link href="/settings">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Update Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  )
}
