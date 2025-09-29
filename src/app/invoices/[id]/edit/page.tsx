"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { getSession } from "@/lib/auth-client"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Calculator, FileText, DollarSign, Calendar, Percent, Tag, CreditCard, MessageSquare, Eye, Users } from "lucide-react"
import { processPaymentTerms } from "@/lib/payment-terms"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { formatCurrency, formatQuantity } from "@/lib/utils"

const invoiceItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0, "Quantity must be positive"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
})

const invoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]).optional(),
  discountValue: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(100),
  notes: z.string().optional(),
  paymentTerms: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

interface Client {
  id: string
  name: string
}

interface Invoice {
  id: string
  invoiceNumber: string
  publicSlug: string
  status: string
  issueDate: string
  dueDate: string
  client: {
    id: string
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
  discountType: string
  discountValue: number
  discountAmount: number
  taxRate: number
  taxAmount: number
  total: number
  notes: string
  paymentTerms: string
}

export default function EditInvoicePage() {
  const router = useRouter()
  const params = useParams()
  const invoiceId = params.id as string
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [subtotal, setSubtotal] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [taxAmount, setTaxAmount] = useState(0)
  const [total, setTotal] = useState(0)
  const [settings, setSettings] = useState<any>(null)
  const [invoice, setInvoice] = useState<Invoice | null>(null)

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: "",
      issueDate: new Date().toLocaleDateString('en-CA'),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'),
      discountType: "PERCENTAGE",
      discountValue: 0,
      taxRate: 0,
      notes: "",
      paymentTerms: "",
      items: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const watchedItems = form.watch("items")
  const watchedTaxRate = form.watch("taxRate")
  const watchedDiscountType = form.watch("discountType")
  const watchedDiscountValue = form.watch("discountValue")

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${invoiceId}`, {
          credentials: "include"
        })
        if (!response.ok) {
          throw new Error("Failed to fetch invoice")
        }
        const data = await response.json()
        setInvoice(data)
        
        // Populate form with invoice data
        form.reset({
          clientId: data.client.id,
          issueDate: new Date(data.issueDate).toLocaleDateString('en-CA'),
          dueDate: data.dueDate ? new Date(data.dueDate).toLocaleDateString('en-CA') : "",
          discountType: data.discountType || "PERCENTAGE",
          discountValue: Number(data.discountValue) || 0,
          taxRate: Number(data.taxRate) || 0,
          notes: data.notes || "",
          paymentTerms: data.paymentTerms || "",
          items: data.items.map((item: any, index: number) => ({
            id: `original_${item.id || index}`, // Mark original items with special ID
            description: item.description,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
          })) || [
            {
              description: "",
              quantity: 1,
              unitPrice: 0,
            },
          ],
        })
      } catch (error) {
        console.error("Error fetching invoice:", error)
        toast.error("Failed to load invoice")
      }
    }

    if (invoiceId) {
      fetchInvoice()
    }
  }, [invoiceId, form])

  // Fetch clients and settings from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [clientsResponse, settingsResponse] = await Promise.all([
          fetch("/api/clients", { credentials: "include" }),
          fetch("/api/settings", { credentials: "include" })
        ])

        if (!clientsResponse.ok) {
          throw new Error("Failed to fetch clients")
        }

        const clientsData = await clientsResponse.json()
        setClients(clientsData)

        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          setSettings(settingsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Update form with settings when available
  useEffect(() => {
    if (settings) {
      form.setValue("paymentTerms", settings.paymentTerms || "")
    }
  }, [settings, form])

  // Calculate totals when items, tax rate, or discount change
  useEffect(() => {
    // Get the current form values instead of relying on watchedItems
    const currentItems = form.getValues("items")
    const currentTaxRate = form.getValues("taxRate")
    const currentDiscountType = form.getValues("discountType")
    const currentDiscountValue = form.getValues("discountValue")
    
    const newSubtotal = currentItems.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice
      return sum + itemTotal
    }, 0)
    
    // Calculate discount
    let newDiscountAmount = 0
    if (currentDiscountValue && currentDiscountValue > 0) {
      if (currentDiscountType === "PERCENTAGE") {
        newDiscountAmount = (newSubtotal * currentDiscountValue) / 100
      } else {
        newDiscountAmount = currentDiscountValue
      }
    }
    
    const subtotalAfterDiscount = newSubtotal - newDiscountAmount
    const newTaxAmount = (subtotalAfterDiscount * (currentTaxRate || 0)) / 100
    const newTotal = subtotalAfterDiscount + newTaxAmount
    
    setSubtotal(newSubtotal)
    setDiscountAmount(newDiscountAmount)
    setTaxAmount(newTaxAmount)
    setTotal(newTotal)
  }, [watchedItems, watchedTaxRate, watchedDiscountType, watchedDiscountValue])

  // Also calculate when form values change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.startsWith('items') || name === 'taxRate' || name === 'discountType' || name === 'discountValue') {
        const currentItems = form.getValues("items")
        const currentTaxRate = form.getValues("taxRate")
        const currentDiscountType = form.getValues("discountType")
        const currentDiscountValue = form.getValues("discountValue")
        
        const newSubtotal = currentItems.reduce((sum, item) => {
          const itemTotal = item.quantity * item.unitPrice
          return sum + itemTotal
        }, 0)
        
        let newDiscountAmount = 0
        if (currentDiscountValue && currentDiscountValue > 0) {
          if (currentDiscountType === "PERCENTAGE") {
            newDiscountAmount = (newSubtotal * currentDiscountValue) / 100
          } else {
            newDiscountAmount = currentDiscountValue
          }
        }
        
        const subtotalAfterDiscount = newSubtotal - newDiscountAmount
        const newTaxAmount = (subtotalAfterDiscount * (currentTaxRate || 0)) / 100
        const newTotal = subtotalAfterDiscount + newTaxAmount
        
        setSubtotal(newSubtotal)
        setDiscountAmount(newDiscountAmount)
        setTaxAmount(newTaxAmount)
        setTotal(newTotal)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const addItem = () => {
    append({ 
      id: `new_${Date.now()}`, // Mark new items with different ID
      description: "", 
      quantity: 1, 
      unitPrice: 0 
    })
  }

  const removeItem = (index: number) => {
    const itemData = form.getValues(`items.${index}`)
    const isOriginalItem = itemData?.id && itemData.id.startsWith('original_')
    
    // Only allow removing new items, not original items
    if (!isOriginalItem) {
      remove(index)
    }
  }

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      // Separate original items (for description updates) and new items
      const originalItems = data.items.filter(item => 
        item.id && item.id.startsWith('original_')
      ).map(item => ({
        id: item.id!.replace('original_', ''), // Remove prefix to get original ID
        description: item.description, // Allow description updates
        quantity: item.quantity, // Keep original quantity
        unitPrice: item.unitPrice, // Keep original unit price
      }))

      const newItems = data.items.filter(item => 
        item.id && !item.id.startsWith('original_')
      ).map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }))

      const invoiceData = {
        ...data,
        originalItems, // Send original items with updated descriptions
        items: newItems, // Send new items
        subtotal,
        discountAmount,
        taxAmount,
        total,
        status: invoice?.status || "DRAFT",
      }
      
      // Get current session to include in request
      const session = await getSession()
      
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify(invoiceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update invoice")
      }

      toast.success("Invoice updated successfully!")
      router.push(`/invoices/${invoiceId}`)
    } catch (error) {
      console.error("Error updating invoice:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update invoice")
    }
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
            <p className="text-muted-foreground mb-4">The invoice you're trying to edit doesn't exist.</p>
            <Button asChild>
              <Link href="/invoices">Back to Invoices</Link>
            </Button>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--blue)]/5 via-[var(--mauve)]/5 to-[var(--peach)]/5"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InZhcig--bWF1dmUpIiBmaWxsLW9wYWNpdHk9IjAuMDMiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--blue)]/20 to-[var(--mauve)]/20 rounded-3xl mb-8 group hover:scale-110 transition-transform duration-500">
              <FileText className="h-10 w-10 text-[var(--blue)] group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-light text-foreground mb-8 group">
              <span className="bg-gradient-to-r from-[var(--blue)] via-[var(--mauve)] to-[var(--peach)] bg-clip-text text-transparent transition-all duration-700">
                Edit Invoice
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Update invoice details and items
            </p>
            <div className="mt-8">
              <Button variant="ghost" size="sm" asChild className="hover:bg-[var(--blue)]/10">
                <Link href={`/invoices/${invoiceId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Invoice
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-[var(--blue)]">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-2 rounded-lg bg-[var(--blue)]/10">
                  <FileText className="h-6 w-6 text-[var(--blue)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                  <p className="text-lg font-bold text-foreground">{invoice.invoiceNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-[var(--green)]">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-2 rounded-lg bg-[var(--green)]/10">
                  <DollarSign className="h-6 w-6 text-[var(--green)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-[var(--mauve)]">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-2 rounded-lg bg-[var(--mauve)]/10">
                  <Calendar className="h-6 w-6 text-[var(--mauve)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                  <p className="text-lg font-bold text-foreground">
                    {form.watch("dueDate") ? new Date(form.watch("dueDate")!).toLocaleDateString() : "Not set"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Invoice Details */}
                <Card className="border-l-4 border-l-[var(--blue)] shadow-lg">
                  <CardHeader className="text-center pb-6">
                    <div className="p-3 rounded-xl bg-[var(--blue)]/10 w-fit mx-auto mb-4">
                      <FileText className="h-8 w-8 text-[var(--blue)]" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Invoice Details</CardTitle>
                    <CardDescription className="text-lg">
                      Basic information about this invoice
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center space-x-2 text-sm font-medium text-foreground">
                              <Users className="h-4 w-4 text-[var(--blue)]" />
                              <span>Client <span className="text-[var(--red)] font-bold">*</span></span>
                            </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled>
                            <FormControl>
                              <SelectTrigger className="h-12 border-2 border-border bg-muted/50 cursor-not-allowed opacity-60">
                                <SelectValue placeholder="Select a client" />
                              </SelectTrigger>
                            </FormControl>
                              <SelectContent>
                                {loading ? (
                                  <SelectItem value="loading" disabled>
                                    Loading clients...
                                  </SelectItem>
                                ) : clients.length === 0 ? (
                                  <SelectItem value="no-clients" disabled>
                                    No clients found
                                  </SelectItem>
                                ) : (
                                  clients.map((client) => (
                                    <SelectItem key={client.id} value={client.id}>
                                      {client.name}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="issueDate"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center space-x-2 text-sm font-medium text-foreground">
                              <Calendar className="h-4 w-4 text-[var(--green)]" />
                              <span>Issue Date <span className="text-[var(--red)] font-bold">*</span></span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field}
                                disabled
                                className="h-12 border-2 border-border bg-muted/50 cursor-not-allowed opacity-60"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center space-x-2 text-sm font-medium text-foreground">
                              <Calendar className="h-4 w-4 text-[var(--mauve)]" />
                              <span>Due Date</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field}
                                className="h-12 border-2 border-border hover:border-[var(--mauve)]/50 focus:border-[var(--mauve)] focus:ring-2 focus:ring-[var(--mauve)]/20 transition-all duration-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    <FormField
                      control={form.control}
                      name="taxRate"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="flex items-center space-x-2 text-sm font-medium text-foreground">
                            <Percent className="h-4 w-4 text-[var(--yellow)]" />
                            <span>Tax Rate (%)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              placeholder="0.00"
                              disabled
                              className="h-12 border-2 border-border bg-muted/50 cursor-not-allowed opacity-60"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="flex items-center space-x-2 text-sm font-medium text-foreground">
                            <Tag className="h-4 w-4 text-[var(--red)]" />
                            <span>Discount Type</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-2 border-border hover:border-[var(--red)]/50 focus:border-[var(--red)] focus:ring-2 focus:ring-[var(--red)]/20 transition-all duration-200">
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                              <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="discountValue"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="flex items-center space-x-2 text-sm font-medium text-foreground">
                            <Tag className="h-4 w-4 text-[var(--red)]" />
                            <span>Discount Value</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="h-12 border-2 border-border hover:border-[var(--red)]/50 focus:border-[var(--red)] focus:ring-2 focus:ring-[var(--red)]/20 transition-all duration-200"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                    <FormField
                      control={form.control}
                      name="paymentTerms"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="flex items-center space-x-2 text-sm font-medium text-foreground">
                            <CreditCard className="h-4 w-4 text-[var(--sky)]" />
                            <span>Payment Terms</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Net 30, Due on receipt" 
                              {...field}
                              disabled
                              className="h-12 border-2 border-border bg-muted/50 cursor-not-allowed opacity-60"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="flex items-center space-x-2 text-sm font-medium text-foreground">
                            <MessageSquare className="h-4 w-4 text-[var(--teal)]" />
                            <span>Notes</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Additional notes or terms..."
                              {...field}
                              className="min-h-[100px] border-2 border-border hover:border-[var(--teal)]/50 focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20 transition-all duration-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Invoice Summary */}
                <Card className="border-l-4 border-l-[var(--green)] shadow-lg bg-gradient-to-br from-[var(--green)]/5 to-[var(--blue)]/5">
                  <CardHeader className="text-center pb-6">
                    <div className="p-3 rounded-xl bg-[var(--green)]/10 w-fit mx-auto mb-4">
                      <Calculator className="h-8 w-8 text-[var(--green)]" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Invoice Summary</CardTitle>
                    <CardDescription className="text-lg">
                      Real-time calculated totals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex justify-between items-center py-3 px-4 bg-background/50 rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
                      <span className="font-semibold text-foreground text-lg">{formatCurrency(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center py-3 px-4 bg-[var(--peach)]/10 rounded-lg border border-[var(--peach)]/20">
                        <span className="text-sm font-medium text-[var(--peach)]">
                          Discount {form.watch("discountType") === "PERCENTAGE" 
                            ? `(${form.watch("discountValue")}%)` 
                            : "(Fixed)"
                          }
                        </span>
                        <span className="font-semibold text-[var(--peach)] text-lg">-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3 px-4 bg-background/50 rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Tax ({watchedTaxRate}%)</span>
                      <span className="font-semibold text-foreground text-lg">{formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="border-t-2 border-[var(--green)]/20 pt-6 bg-gradient-to-r from-[var(--green)]/10 to-[var(--blue)]/10 rounded-xl px-6 py-4 shadow-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xl text-foreground">Total</span>
                        <span className="font-bold text-3xl text-[var(--green)]">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Items Section */}
              <Card className="border-l-4 border-l-[var(--mauve)] shadow-lg">
                <CardHeader className="text-center pb-6">
                  <div className="p-3 rounded-xl bg-[var(--mauve)]/10 w-fit mx-auto mb-4">
                    <Tag className="h-8 w-8 text-[var(--mauve)]" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Invoice Items</CardTitle>
                  <CardDescription className="text-lg">
                    Add products or services to your invoice
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-2 border-[var(--mauve)]/20">
                            <TableHead className="text-[var(--mauve)] font-bold">Description</TableHead>
                            <TableHead className="text-[var(--mauve)] font-bold text-center">Quantity</TableHead>
                            <TableHead className="text-[var(--mauve)] font-bold text-right">Unit Price</TableHead>
                            <TableHead className="text-[var(--mauve)] font-bold text-right">Total</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((field, index) => {
                            // Check if this is an original item by looking at the form values
                            const itemData = form.getValues(`items.${index}`)
                            const isOriginalItem = itemData?.id && itemData.id.startsWith('original_')
                            const isNewItem = !isOriginalItem
                            
                            return (
                              <TableRow key={field.id} className={`transition-colors ${isOriginalItem ? 'bg-muted/30' : 'hover:bg-muted/50'}`}>
                                <TableCell className="p-2">
                                  <FormField
                                    control={form.control}
                                    name={`items.${index}.description`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            placeholder="Item description"
                                            className="border-2 border-border hover:border-[var(--mauve)]/50 focus:border-[var(--mauve)] focus:ring-2 focus:ring-[var(--mauve)]/20 transition-all duration-200"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell className="p-2">
                                  <FormField
                                    control={form.control}
                                    name={`items.${index}.quantity`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            min="0"
                                            step="1"
                                            disabled={!!isOriginalItem}
                                            className={`text-center border-2 transition-all duration-200 ${
                                              isOriginalItem 
                                                ? 'border-border bg-muted/50 cursor-not-allowed opacity-60' 
                                                : 'border-border hover:border-[var(--mauve)]/50 focus:border-[var(--mauve)] focus:ring-2 focus:ring-[var(--mauve)]/20'
                                            }`}
                                            {...field}
                                            onChange={(e) => field.onChange(Math.round(parseFloat(e.target.value) || 0))}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell className="p-2">
                                  <FormField
                                    control={form.control}
                                    name={`items.${index}.unitPrice`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            disabled={!!isOriginalItem}
                                            className={`text-right border-2 transition-all duration-200 ${
                                              isOriginalItem 
                                                ? 'border-border bg-muted/50 cursor-not-allowed opacity-60' 
                                                : 'border-border hover:border-[var(--mauve)]/50 focus:border-[var(--mauve)] focus:ring-2 focus:ring-[var(--mauve)]/20'
                                            }`}
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell className="p-2 text-right font-medium">
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  }).format((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0))}
                                </TableCell>
                                <TableCell className="p-2">
                                  {isNewItem ? (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeItem(index)}
                                      className="group bg-[var(--red)]/5 hover:bg-gradient-to-br hover:from-[var(--red)] hover:to-red-500 text-[var(--red)] hover:text-white transition-all duration-500 ease-out h-8 w-8 p-0 rounded-2xl hover:scale-110 hover:shadow-2xl hover:shadow-[var(--red)]/50 border border-[var(--red)]/20 hover:border-red-300 hover:ring-2 hover:ring-[var(--red)]/30 hover:-translate-y-2 hover:rotate-1 pointer-events-auto backdrop-blur-sm hover:backdrop-blur-none"
                                      title="Remove Item"
                                    >
                                      <Trash2 className="h-4 w-4 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:drop-shadow-xl group-hover:brightness-110" />
                                    </Button>
                                  ) : (
                                    <div className="flex items-center justify-center h-8 w-8">
                                      <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded hidden">
                                        Original
                                      </div>
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addItem}
                      className="w-full border-2 border-border hover:border-[var(--mauve)]/50 text-[var(--mauve)] hover:bg-[var(--mauve)]/5 transition-all duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardContent>
              </Card>


            <div className="flex justify-center pt-8 border-t border-border">
              <div className="flex space-x-6">
                <Button type="button" variant="outline" asChild>
                  <Link href={`/invoices/${invoiceId}`}>Cancel</Link>
                </Button>
                <Button type="submit" className="bg-[var(--blue)] hover:bg-[var(--blue)]/90">
                  <FileText className="h-5 w-5 mr-2" />
                  Update Invoice
                </Button>
              </div>
            </div>
            </form>
          </Form>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </ProtectedLayout>
  )
}
