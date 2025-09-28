"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Save, User, Building, DollarSign, FileText, Settings as SettingsIcon, CreditCard, Percent, Hash, Calendar, Image, Mail, User2, Eye } from "lucide-react"
import { getPaymentTermsPreview } from "@/lib/payment-terms"

const companySchema = z.object({
  companyName: z.string().min(1, "Full name is required"),
  companyEmail: z.string().email("Invalid email address"),
  logo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
})

const invoiceSchema = z.object({
  defaultTaxRate: z.number().min(0).max(100),
  currency: z.string().min(1, "Currency is required"),
  invoicePrefix: z.string().min(1, "Invoice prefix is required"),
  nextInvoiceNumber: z.number().min(1, "Next invoice number must be at least 1"),
  paymentTerms: z.string().optional(),
})

type CompanyFormData = z.infer<typeof companySchema>
type InvoiceFormData = z.infer<typeof invoiceSchema>

// Default values - will be replaced by API data
const defaultCompanyData = {
  companyName: "",
  companyEmail: "",
  logo: "",
}

const defaultInvoiceData = {
  defaultTaxRate: 0,
  currency: "USD",
  invoicePrefix: "INV",
  nextInvoiceNumber: 1,
  paymentTerms: "",
}

export default function SettingsPage() {
  const [companyData, setCompanyData] = useState(defaultCompanyData)
  const [invoiceData, setInvoiceData] = useState(defaultInvoiceData)
  const [loading, setLoading] = useState(true)
  const [savingCompany, setSavingCompany] = useState(false)
  const [savingInvoice, setSavingInvoice] = useState(false)

  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: companyData,
  })

  const invoiceForm = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: invoiceData,
  })

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/settings", {
          credentials: "include"
        })
        if (response.ok) {
          const data = await response.json()
          
          // Ensure all fields have proper default values
          const companyFormData = {
            companyName: data.companyName || "",
            companyEmail: data.companyEmail || "",
            logo: data.logo || "",
          }
          
          const invoiceFormData = {
            defaultTaxRate: data.defaultTaxRate || 0,
            currency: data.currency || "USD",
            invoicePrefix: data.invoicePrefix || "INV",
            nextInvoiceNumber: data.nextInvoiceNumber || 1,
            paymentTerms: data.paymentTerms || "",
          }
          
          setCompanyData(companyFormData)
          setInvoiceData(invoiceFormData)
          companyForm.reset(companyFormData)
          invoiceForm.reset(invoiceFormData)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const onCompanySubmit = async (data: CompanyFormData) => {
    try {
      setSavingCompany(true)
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to update personal settings")
      }

      await response.json()
      
      toast.success("Personal settings updated successfully")
    } catch (error) {
      console.error("Error updating personal settings:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update personal settings")
    } finally {
      setSavingCompany(false)
    }
  }

  const onInvoiceSubmit = async (data: InvoiceFormData) => {
    try {
      setSavingInvoice(true)
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to update invoice settings")
      }

      await response.json()
      
      toast.success("Invoice settings updated successfully")
    } catch (error) {
      console.error("Error updating invoice settings:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update invoice settings")
    } finally {
      setSavingInvoice(false)
    }
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SettingsIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your account and application preferences</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading settings...</p>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SettingsIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account and application preferences</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="company" className="flex items-center space-x-2">
              <User2 className="h-4 w-4" />
              <span>Personal</span>
            </TabsTrigger>
            <TabsTrigger value="invoice" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Invoice</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col items-center text-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <User2 className="h-5 w-5 text-blue-600" />
                    <span>Personal Information</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-center">
                  Update your personal details that appear on invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...companyForm}>
                  <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={companyForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center space-x-2 text-sm font-medium">
                              <User2 className="h-4 w-4 text-blue-600" />
                              <span>Full Name *</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your Full Name" 
                                {...field}
                                className="hover:border-blue-300 focus:border-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={companyForm.control}
                        name="companyEmail"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center space-x-2 text-sm font-medium">
                              <Mail className="h-4 w-4 text-green-600" />
                              <span>Email *</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="billing@yourcompany.com" 
                                {...field}
                                className="hover:border-blue-300 focus:border-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={companyForm.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center space-x-2 text-sm font-medium">
                            <Image className="h-4 w-4 text-purple-600" />
                            <span>Logo URL</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="url" 
                              placeholder="https://example.com/logo.png" 
                              {...field}
                              className="hover:border-blue-300 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-gray-500">
                            Enter a URL to your company logo image. The image will appear on your invoices.
                          </p>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pt-4 border-t">
                      <Button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={savingCompany}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {savingCompany ? "Saving..." : "Save Personal Settings"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoice">
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col items-center text-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Invoice Settings</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-center">
                  Configure default settings for new invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...invoiceForm}>
                  <form onSubmit={invoiceForm.handleSubmit(onInvoiceSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={invoiceForm.control}
                        name="defaultTaxRate"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center space-x-2 text-sm font-medium">
                              <Percent className="h-4 w-4 text-orange-600" />
                              <span>Default Tax Rate (%)</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.001"
                                min="0"
                                max="100"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(value === "" ? 0 : parseFloat(value) || 0)
                                }}
                                className="hover:border-blue-300 focus:border-blue-500"
                              />
                            </FormControl>
                            <p className="text-xs text-gray-500">
                              Enter exact percentage (e.g., 8.375 for 8.375%)
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={invoiceForm.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center space-x-2 text-sm font-medium">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span>Currency</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="USD" 
                                {...field}
                                className="hover:border-blue-300 focus:border-blue-500"
                              />
                            </FormControl>
                            <p className="text-xs text-gray-500">
                              Enter currency code (e.g., USD, EUR, GBP)
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={invoiceForm.control}
                        name="invoicePrefix"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center space-x-2 text-sm font-medium">
                              <Hash className="h-4 w-4 text-blue-600" />
                              <span>Invoice Prefix</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="INV" 
                                {...field}
                                className="hover:border-blue-300 focus:border-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={invoiceForm.control}
                        name="nextInvoiceNumber"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center space-x-2 text-sm font-medium">
                              <Hash className="h-4 w-4 text-indigo-600" />
                              <span>Next Invoice Number</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(value === "" ? 1 : parseInt(value) || 1)
                                }}
                                className="hover:border-blue-300 focus:border-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={invoiceForm.control}
                      name="paymentTerms"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center space-x-2 text-sm font-medium">
                            <CreditCard className="h-4 w-4 text-purple-600" />
                            <span>Default Payment Terms</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="e.g., All invoices are due within [X] days of the invoice date, after which a late fee of 30% interest will be applied..." 
                              rows={3}
                              {...field}
                              className="hover:border-blue-300 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                          {field.value && field.value.includes('[X]') && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Eye className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Preview (30-day example):</span>
                              </div>
                              <p className="text-sm text-blue-800">
                                {getPaymentTermsPreview(field.value)}
                              </p>
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pt-4 border-t">
                      <Button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={savingInvoice}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {savingInvoice ? "Saving..." : "Save Invoice Settings"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col items-center text-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Account Settings</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-center">
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">Profile Information</h3>
                          <p className="text-sm text-gray-600">
                            Update your personal information and preferences
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300">
                        Update Profile
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <SettingsIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">Security</h3>
                          <p className="text-sm text-gray-600">
                            Manage your password and security settings
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" className="hover:bg-green-50 hover:text-green-600 hover:border-green-300">
                        Change Password
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <FileText className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">Data Export</h3>
                          <p className="text-sm text-gray-600">
                            Download your data in a portable format
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300">
                        Export Data
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  )
}
