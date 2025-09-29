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
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Calculator, FileText, DollarSign, Calendar, Percent, Tag, CreditCard, MessageSquare, Eye, Users } from "lucide-react"
import { processPaymentTerms } from "@/lib/payment-terms"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { formatCurrency, formatQuantity } from "@/lib/utils"

const invoiceItemSchema = z.object({
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

export default function NewInvoicePage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [subtotal, setSubtotal] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [taxAmount, setTaxAmount] = useState(0)
  const [total, setTotal] = useState(0)
  const [settings, setSettings] = useState<any>(null)

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: "",
      issueDate: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format in local timezone
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'), // 30 days from today
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

  // Update form when settings are loaded
  useEffect(() => {
    if (settings) {
      form.reset({
        ...form.getValues(),
        taxRate: Number(settings.invoice?.taxRate) || 0,
        paymentTerms: settings.invoice?.paymentTerms || "",
        // Note: currency and invoicePrefix are handled by the backend
        // when creating the invoice, so we don't need to set them in the form
      })
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
  const calculateTotals = () => {
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
  }

  const addItem = () => {
    append({
      description: "",
      quantity: 1,
      unitPrice: 0,
    })
  }

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      const invoiceData = {
        ...data,
        subtotal,
        discountAmount,
        taxAmount,
        total,
        status: "DRAFT" as const,
      }
      
      // Get current session to include in request
      const session = await getSession()
      
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify(invoiceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        throw new Error(errorData.details || errorData.error || "Failed to create invoice")
      }

      await response.json()
      
      toast.success("Invoice created successfully")
      router.push("/invoices")
    } catch (error) {
      console.error("Error creating invoice:", error)
      toast.error("Failed to create invoice")
    }
  }

  return (
    <ProtectedLayout>
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--blue)]/8 via-[var(--mauve)]/8 to-[var(--peach)]/8"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InZhcig--bWF1dmUpIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[var(--blue)]/15 to-[var(--mauve)]/15 rounded-3xl mb-8 group hover:scale-110 transition-all duration-500 shadow-lg shadow-[var(--blue)]/10">
              <FileText className="h-12 w-12 text-[var(--blue)] group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-light text-foreground mb-8 group">
              <span className="bg-gradient-to-r from-[var(--blue)] via-[var(--mauve)] to-[var(--peach)] bg-clip-text text-transparent transition-all duration-700 drop-shadow-sm">
                New Invoice
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create a professional invoice for your client
            </p>
            <div className="mt-8">
              <Button variant="ghost" size="sm" asChild className="hover:bg-gradient-to-r hover:from-[var(--blue)]/10 hover:to-[var(--mauve)]/10 transition-all duration-300 shadow-sm hover:shadow-md">
                <Link href="/invoices">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Invoices
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-xl hover:shadow-[var(--blue)]/10 transition-all duration-300 border-l-4 border-l-[var(--blue)] bg-gradient-to-br from-[var(--blue)]/5 to-transparent hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--blue)]/15 to-[var(--blue)]/5 shadow-lg shadow-[var(--blue)]/10">
                  <FileText className="h-7 w-7 text-[var(--blue)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                  <p className="text-2xl font-bold text-foreground">Auto-generated</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl hover:shadow-[var(--green)]/10 transition-all duration-300 border-l-4 border-l-[var(--green)] bg-gradient-to-br from-[var(--green)]/5 to-transparent hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--green)]/15 to-[var(--green)]/5 shadow-lg shadow-[var(--green)]/10">
                  <DollarSign className="h-7 w-7 text-[var(--green)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl hover:shadow-[var(--mauve)]/10 transition-all duration-300 border-l-4 border-l-[var(--mauve)] bg-gradient-to-br from-[var(--mauve)]/5 to-transparent hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--mauve)]/15 to-[var(--mauve)]/5 shadow-lg shadow-[var(--mauve)]/10">
                  <Calendar className="h-7 w-7 text-[var(--mauve)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                  <p className="text-2xl font-bold text-foreground">
                    {form.watch("dueDate") ? new Date(form.watch("dueDate")!).toLocaleDateString() : "Not set"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Invoice Details */}
              <Card className="lg:col-span-2 border-l-4 border-l-[var(--blue)] shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[var(--blue)]/5 to-transparent">
                <CardHeader className="text-center pb-8">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--blue)]/15 to-[var(--blue)]/5 w-fit mx-auto mb-6 shadow-lg shadow-[var(--blue)]/10">
                    <FileText className="h-10 w-10 text-[var(--blue)]" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Invoice Details</CardTitle>
                  <CardDescription className="text-xl">
                    Basic information about this invoice
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="flex items-center space-x-2 text-base font-semibold text-foreground">
                            <Users className="h-5 w-5 text-[var(--blue)]" />
                            <span>Client <span className="text-[var(--red)] font-bold">*</span></span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 border-2 border-border hover:border-[var(--blue)]/50 focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/20 transition-all duration-200 text-base">
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
                          <FormMessage className="text-sm text-[var(--red)]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="issueDate"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="flex items-center space-x-2 text-base font-semibold text-foreground">
                            <Calendar className="h-5 w-5 text-[var(--green)]" />
                            <span>Issue Date <span className="text-[var(--red)] font-bold">*</span></span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field}
                              className="h-14 border-2 border-border hover:border-[var(--green)]/50 focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20 transition-all duration-200 text-base"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-[var(--red)]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="flex items-center space-x-2 text-base font-semibold text-foreground">
                            <Calendar className="h-5 w-5 text-[var(--mauve)]" />
                            <span>Due Date</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field}
                              className="h-14 border-2 border-border hover:border-[var(--mauve)]/50 focus:border-[var(--mauve)] focus:ring-2 focus:ring-[var(--mauve)]/20 transition-all duration-200 text-base"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-[var(--red)]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="taxRate"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="flex items-center space-x-2 text-base font-semibold text-foreground">
                            <Percent className="h-5 w-5 text-[var(--yellow)]" />
                            <span>Tax Rate (%)</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.001"
                              min="0"
                              max="100"
                              {...field}
                              className="h-14 border-2 border-border hover:border-[var(--yellow)]/50 focus:border-[var(--yellow)] focus:ring-2 focus:ring-[var(--yellow)]/20 transition-all duration-200 text-base"
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0)
                                // Trigger calculation after a short delay to ensure form is updated
                                setTimeout(calculateTotals, 100)
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-[var(--red)]" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Discount Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="flex items-center space-x-2 text-base font-semibold text-foreground">
                            <Tag className="h-5 w-5 text-[var(--pink)]" />
                            <span>Discount Type</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 border-2 border-border hover:border-[var(--pink)]/50 focus:border-[var(--pink)] focus:ring-2 focus:ring-[var(--pink)]/20 transition-all duration-200 text-base">
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                              <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-sm text-[var(--red)]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discountValue"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="flex items-center space-x-2 text-base font-semibold text-foreground">
                            <DollarSign className="h-5 w-5 text-[var(--peach)]" />
                            <span>Discount Value</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              min="0"
                              placeholder={form.watch("discountType") === "PERCENTAGE" ? "e.g., 10" : "e.g., 50.00"}
                              {...field}
                              className="h-14 border-2 border-border hover:border-[var(--peach)]/50 focus:border-[var(--peach)] focus:ring-2 focus:ring-[var(--peach)]/20 transition-all duration-200 text-base"
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0)
                                setTimeout(calculateTotals, 100)
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-[var(--red)]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="flex items-center space-x-2 text-base font-semibold text-foreground">
                          <CreditCard className="h-5 w-5 text-[var(--sky)]" />
                          <span>Payment Terms</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={settings?.paymentTerms || "e.g., Net 30 days"}
                            {...field}
                            className="h-14 border-2 border-border hover:border-[var(--sky)]/50 focus:border-[var(--sky)] focus:ring-2 focus:ring-[var(--sky)]/20 transition-all duration-200 text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-[var(--red)]" />
                        {field.value && field.value.includes('[X]') && (
                          <div className="mt-3 p-4 bg-[var(--sky)]/5 border border-[var(--sky)]/20 rounded-xl">
                            <div className="flex items-center space-x-2 mb-2">
                              <Eye className="h-4 w-4 text-[var(--sky)]" />
                              <span className="text-sm font-medium text-foreground">Preview:</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {processPaymentTerms(field.value, form.watch("issueDate") || new Date().toISOString(), form.watch("dueDate") || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())}
                            </p>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="flex items-center space-x-2 text-base font-semibold text-foreground">
                          <MessageSquare className="h-5 w-5 text-[var(--teal)]" />
                          <span>Notes</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional notes or terms..."
                            {...field}
                            className="min-h-[120px] border-2 border-border hover:border-[var(--teal)]/50 focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20 transition-all duration-200 text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-[var(--red)]" />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Invoice Summary */}
              <Card className="border-l-4 border-l-[var(--green)] shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[var(--green)]/5 to-[var(--blue)]/5">
                <CardHeader className="text-center pb-8">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--green)]/15 to-[var(--green)]/5 w-fit mx-auto mb-6 shadow-lg shadow-[var(--green)]/10">
                    <Calculator className="h-10 w-10 text-[var(--green)]" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Invoice Summary</CardTitle>
                  <CardDescription className="text-xl">
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

            {/* Invoice Items */}
            <Card className="border-l-4 border-l-[var(--mauve)] shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[var(--mauve)]/5 to-transparent">
              <CardHeader className="text-center pb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--mauve)]/15 to-[var(--mauve)]/5 w-fit mx-auto mb-6 shadow-lg shadow-[var(--mauve)]/10">
                  <FileText className="h-10 w-10 text-[var(--mauve)]" />
                </div>
                <CardTitle className="text-3xl font-bold">Invoice Items</CardTitle>
                <CardDescription className="text-xl">
                  Add line items to your invoice
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-[var(--mauve)]/10 to-[var(--pink)]/10 border-b-2 border-[var(--mauve)]/20">
                      <TableHead className="font-bold text-foreground py-4">Description</TableHead>
                      <TableHead className="w-24 font-bold text-foreground py-4">Quantity</TableHead>
                      <TableHead className="w-32 font-bold text-foreground py-4">Unit Price</TableHead>
                      <TableHead className="w-32 font-bold text-foreground py-4">Total</TableHead>
                      <TableHead className="w-12 py-4"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id} className="border-b border-border/50">
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    placeholder="Item description" 
                                    {...field}
                                    className="h-12 border-2 border-border hover:border-[var(--mauve)]/50 focus:border-[var(--mauve)] focus:ring-2 focus:ring-[var(--mauve)]/20 transition-all duration-200 text-base"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="1"
                                    min="0"
                                    {...field}
                                    className="h-12 border-2 border-border hover:border-[var(--green)]/50 focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20 transition-all duration-200 text-base"
                                    onChange={(e) => {
                                      const value = Math.round(parseFloat(e.target.value) || 0)
                                      field.onChange(value)
                                      // Trigger calculation after a short delay to ensure form is updated
                                      setTimeout(calculateTotals, 100)
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.unitPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    min="0"
                                    {...field}
                                    className="h-12 border-2 border-border hover:border-[var(--blue)]/50 focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/20 transition-all duration-200 text-base"
                                    onChange={(e) => {
                                      const value = parseFloat(e.target.value) || 0
                                      field.onChange(value)
                                      // Trigger calculation after a short delay to ensure form is updated
                                      setTimeout(calculateTotals, 100)
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-foreground">
{formatCurrency((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0))}
                          </span>
                        </TableCell>
                        <TableCell className="pointer-events-none">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            disabled={fields.length === 1}
                            className="group bg-[var(--red)]/5 hover:bg-gradient-to-br hover:from-[var(--red)] hover:to-red-500 text-[var(--red)] hover:text-white disabled:opacity-50 transition-all duration-500 ease-out h-8 w-8 p-0 rounded-2xl hover:scale-110 hover:shadow-2xl hover:shadow-[var(--red)]/50 border border-[var(--red)]/20 hover:border-red-300 hover:ring-2 hover:ring-[var(--red)]/30 hover:-translate-y-2 hover:rotate-1 pointer-events-auto backdrop-blur-sm hover:backdrop-blur-none"
                            title="Remove Item"
                          >
                            <Trash2 className="h-4 w-4 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:drop-shadow-xl group-hover:brightness-110" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-8 flex justify-center">
                  <Button type="button" onClick={addItem} className="bg-gradient-to-r from-[var(--mauve)] to-[var(--mauve)]/90 hover:from-[var(--mauve)]/90 hover:to-[var(--mauve)]/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center pt-12 border-t-2 border-border/50">
              <div className="flex space-x-8">
                <Button type="button" variant="outline" asChild className="h-12 px-8 border-2 border-border hover:border-[var(--mauve)]/50 hover:text-[var(--mauve)] transition-all duration-300 shadow-sm hover:shadow-md">
                  <Link href="/invoices">Cancel</Link>
                </Button>
                <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-[var(--blue)] to-[var(--blue)]/90 hover:from-[var(--blue)]/90 hover:to-[var(--blue)]/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                  <FileText className="h-5 w-5 mr-2" />
                  Create Invoice
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
