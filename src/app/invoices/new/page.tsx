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
import { ArrowLeft, Plus, Trash2, Calculator, FileText, DollarSign, Calendar, Percent, Tag, CreditCard, MessageSquare, Eye } from "lucide-react"
import { processPaymentTerms } from "@/lib/payment-terms"
import Link from "next/link"
import { useState, useEffect } from "react"

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
        taxRate: Number(settings.defaultTaxRate) || 0,
        paymentTerms: settings.paymentTerms || "",
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
      <div className="space-y-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/invoices">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Invoices
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Invoice</h1>
              <p className="text-gray-600">Create a professional invoice for your client</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Invoice Number</p>
                    <p className="text-lg font-bold text-gray-900">Auto-generated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="text-lg font-bold text-gray-900">${total.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Calendar className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Due Date</p>
                    <p className="text-lg font-bold text-gray-900">
                      {form.watch("dueDate") ? new Date(form.watch("dueDate")!).toLocaleDateString() : "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Invoice Details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                  <CardDescription>
                    Basic information about this invoice
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span>Client *</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="hover:border-blue-300 focus:border-blue-500">
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
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span>Issue Date *</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field}
                              className="hover:border-blue-300 focus:border-blue-500"
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
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span>Due Date</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field}
                              className="hover:border-blue-300 focus:border-blue-500"
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
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Percent className="h-4 w-4 text-orange-600" />
                            <span>Tax Rate (%)</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.001"
                              min="0"
                              max="100"
                              {...field}
                              className="hover:border-blue-300 focus:border-blue-500"
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0)
                                // Trigger calculation after a short delay to ensure form is updated
                                setTimeout(calculateTotals, 100)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Discount Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Tag className="h-4 w-4 text-indigo-600" />
                            <span>Discount Type</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="hover:border-blue-300 focus:border-blue-500">
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
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-red-600" />
                            <span>Discount Value</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              min="0"
                              placeholder={form.watch("discountType") === "PERCENTAGE" ? "e.g., 10" : "e.g., 50.00"}
                              {...field}
                              className="hover:border-blue-300 focus:border-blue-500"
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0)
                                setTimeout(calculateTotals, 100)
                              }}
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
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-purple-600" />
                          <span>Payment Terms</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={settings?.paymentTerms || "e.g., Net 30 days"}
                            {...field}
                            className="hover:border-blue-300 focus:border-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                        {field.value && field.value.includes('[X]') && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Eye className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900">Preview:</span>
                            </div>
                            <p className="text-sm text-blue-800">
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
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4 text-teal-600" />
                          <span>Notes</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional notes or terms..."
                            {...field}
                            className="hover:border-blue-300 focus:border-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Invoice Summary */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-blue-900">
                    <Calculator className="h-5 w-5" />
                    <span>Invoice Summary</span>
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Real-time calculated totals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-700">Subtotal</span>
                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center py-2 bg-green-50 rounded-lg px-3">
                      <span className="text-sm font-medium text-green-700">
                        Discount {form.watch("discountType") === "PERCENTAGE" 
                          ? `(${form.watch("discountValue")}%)` 
                          : "(Fixed)"
                        }
                      </span>
                      <span className="font-semibold text-green-800">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-700">Tax ({watchedTaxRate}%)</span>
                    <span className="font-semibold text-gray-900">${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-blue-200 pt-4 bg-white rounded-lg px-4 py-3 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-blue-900">Total</span>
                      <span className="font-bold text-2xl text-blue-900">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Invoice Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span>Invoice Items</span>
                    </CardTitle>
                    <CardDescription>
                      Add line items to your invoice
                    </CardDescription>
                  </div>
                  <Button type="button" onClick={addItem} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2 text-white" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Description</TableHead>
                      <TableHead className="w-24 font-semibold">Quantity</TableHead>
                      <TableHead className="w-32 font-semibold">Unit Price</TableHead>
                      <TableHead className="w-32 font-semibold">Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id} className="hover:bg-gray-50 transition-colors">
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
                                    className="hover:border-blue-300 focus:border-blue-500"
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
                                    className="hover:border-blue-300 focus:border-blue-500"
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
                                    className="hover:border-blue-300 focus:border-blue-500"
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
                          <span className="font-semibold text-gray-900">
                            ${((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0)).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            disabled={fields.length === 1}
                            className="hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            title="Remove Item"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" asChild className="hover:bg-gray-50">
                <Link href="/invoices">Cancel</Link>
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                <FileText className="h-4 w-4 mr-2 text-white" />
                Create Invoice
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ProtectedLayout>
  )
}
