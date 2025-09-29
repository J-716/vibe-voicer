"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  CreditCard, 
  Download,
  Settings as SettingsIcon,
  User2,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Save,
  DollarSign,
  Percent,
  Calendar,
  Hash,
  Key
} from "lucide-react"
import { Footer } from "@/components/footer"
import { ProtectedLayout } from "@/components/protected-layout"

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [activeTab, setActiveTab] = useState("company")
  
  // Personal settings state
  const [personalSettings, setPersonalSettings] = useState({
    fullName: "",
    email: ""
  })
  const [isSaving, setIsSaving] = useState(false)

  // Invoice settings state
  const [invoiceSettings, setInvoiceSettings] = useState({
    taxRate: 0,
    currency: "USD",
    invoicePrefix: "INV",
    nextInvoiceNumber: 1,
    paymentTerms: ""
  })
  const [isSavingInvoice, setIsSavingInvoice] = useState(false)

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [isSavingAccount, setIsSavingAccount] = useState(false)

  // Load personal settings on component mount
  useEffect(() => {
    const loadPersonalSettings = async () => {
      try {
        const response = await fetch("/api/settings/personal", {
          credentials: "include"
        })
        
        if (response.ok) {
          const data = await response.json()
          setPersonalSettings({
            fullName: data.fullName || "",
            email: data.email || ""
          })
        }
      } catch (error) {
        console.error("Error loading personal settings:", error)
      }
    }

    loadPersonalSettings()
  }, [])

  // Load invoice settings on component mount
  useEffect(() => {
    const loadInvoiceSettings = async () => {
      try {
        const response = await fetch("/api/settings/invoice", {
          credentials: "include"
        })
        
        if (response.ok) {
          const data = await response.json()
          setInvoiceSettings({
            taxRate: data.taxRate || 0,
            currency: data.currency || "USD",
            invoicePrefix: data.invoicePrefix || "INV",
            nextInvoiceNumber: data.nextInvoiceNumber || 1,
            paymentTerms: data.paymentTerms || ""
          })
        }
      } catch (error) {
        console.error("Error loading invoice settings:", error)
      }
    }

    loadInvoiceSettings()
  }, [])

  // Handle personal settings save
  const handleSavePersonalSettings = async () => {
    try {
      setIsSaving(true)
      
      // TODO: Replace with actual API call
      const response = await fetch("/api/settings/personal", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(personalSettings),
      })

      if (!response.ok) {
        throw new Error("Failed to save personal settings")
      }

      toast.success("Personal settings saved successfully!")
    } catch (error) {
      console.error("Error saving personal settings:", error)
      toast.error("Failed to save personal settings")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle invoice settings save
  const handleSaveInvoiceSettings = async () => {
    try {
      setIsSavingInvoice(true)
      
      const response = await fetch("/api/settings/invoice", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(invoiceSettings),
      })

      if (!response.ok) {
        throw new Error("Failed to save invoice settings")
      }

      toast.success("Invoice settings saved successfully!")
    } catch (error) {
      console.error("Error saving invoice settings:", error)
      toast.error("Failed to save invoice settings")
    } finally {
      setIsSavingInvoice(false)
    }
  }

  // Handle account settings save
  const handleSaveAccountSettings = async () => {
    try {
      setIsSavingAccount(true)
      
      // Validate passwords match
      if (accountSettings.newPassword !== accountSettings.confirmPassword) {
        toast.error("New passwords do not match")
        return
      }

      const response = await fetch("/api/settings/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: accountSettings.currentPassword,
          newPassword: accountSettings.newPassword
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save account settings")
      }

      toast.success("Account settings saved successfully!")
      
      // Clear password fields
      setAccountSettings({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error) {
      console.error("Error saving account settings:", error)
      toast.error("Failed to save account settings")
    } finally {
      setIsSavingAccount(false)
    }
  }

  return (
    <ProtectedLayout>
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--mauve)]/5 via-[var(--blue)]/5 to-[var(--peach)]/5"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InZhcig--bWF1dmUpIiBmaWxsLW9wYWNpdHk9IjAuMDMiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--mauve)]/20 to-[var(--pink)]/20 rounded-3xl mb-8 group hover:scale-110 transition-transform duration-500">
              <SettingsIcon className="h-10 w-10 text-[var(--mauve)] group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-light text-foreground mb-8 group">
              <span className="bg-gradient-to-r from-[var(--mauve)] via-[var(--blue)] to-[var(--peach)] bg-clip-text text-transparent transition-all duration-700">
                Settings
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Customize your experience and manage your account preferences
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-16">
          {/* Quick Stats */}
          <section className="py-16 mb-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  <span className="bg-gradient-to-r from-[var(--mauve)] to-[var(--blue)] bg-clip-text text-transparent">Quick Access</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Jump into the settings you need most
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                <Card 
                  className={`border-l-4 border-l-[var(--mauve)] hover:shadow-xl hover:shadow-[var(--mauve)]/20 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer group h-full ${
                    activeTab === "company" 
                      ? "shadow-xl shadow-[var(--mauve)]/20 -translate-y-2 scale-[1.02]" 
                      : ""
                  }`}
                  onClick={() => setActiveTab("company")}
                >
                  <CardHeader className="text-center pb-4 h-full flex flex-col justify-center items-center min-h-[200px]">
                    <div className="p-4 rounded-xl bg-[var(--mauve)]/10 w-fit mx-auto mb-4 group-hover:bg-[var(--mauve)]/20 group-hover:scale-110 transition-all duration-300">
                      <User2 className="h-8 w-8 text-[var(--mauve)] group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <CardTitle className="text-xl mb-2 text-center">Personal Info</CardTitle>
                    <CardDescription className="text-base text-center">
                      Update your personal details and preferences
                    </CardDescription>
                  </CardHeader>
                </Card>
                  
                <Card 
                  className={`border-l-4 border-l-[var(--blue)] hover:shadow-xl hover:shadow-[var(--blue)]/20 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer group h-full ${
                    activeTab === "invoice" 
                      ? "shadow-xl shadow-[var(--blue)]/20 -translate-y-2 scale-[1.02]" 
                      : ""
                  }`}
                  onClick={() => setActiveTab("invoice")}
                >
                  <CardHeader className="text-center pb-4 h-full flex flex-col justify-center items-center min-h-[200px]">
                    <div className="p-4 rounded-xl bg-[var(--blue)]/10 w-fit mx-auto mb-4 group-hover:bg-[var(--blue)]/20 group-hover:scale-110 transition-all duration-300">
                      <FileText className="h-8 w-8 text-[var(--blue)] group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <CardTitle className="text-xl mb-2 text-center">Invoice Settings</CardTitle>
                    <CardDescription className="text-base text-center">
                      Customize default invoice preferences
                    </CardDescription>
                  </CardHeader>
                </Card>
                  
                <Card 
                  className={`border-l-4 border-l-[var(--green)] hover:shadow-xl hover:shadow-[var(--green)]/20 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer group h-full ${
                    activeTab === "account" 
                      ? "shadow-xl shadow-[var(--green)]/20 -translate-y-2 scale-[1.02]" 
                      : ""
                  }`}
                  onClick={() => setActiveTab("account")}
                >
                  <CardHeader className="text-center pb-4 h-full flex flex-col justify-center items-center min-h-[200px]">
                    <div className="p-4 rounded-xl bg-[var(--green)]/10 w-fit mx-auto mb-4 group-hover:bg-[var(--green)]/20 group-hover:scale-110 transition-all duration-300">
                      <SettingsIcon className="h-8 w-8 text-[var(--green)] group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <CardTitle className="text-xl mb-2 text-center">Account</CardTitle>
                    <CardDescription className="text-base text-center">
                      Manage your account and security settings
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </section>
          

          <TabsContent value="company">
            <Card className="border-l-4 border-l-[var(--mauve)] shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="p-3 rounded-xl bg-[var(--mauve)]/10 w-fit mx-auto mb-4">
                  <User2 className="h-8 w-8 text-[var(--mauve)]" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Personal Information
                </CardTitle>
                <CardDescription className="text-lg">
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-base font-medium text-foreground text-center block">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={personalSettings.fullName}
                      onChange={(e) => setPersonalSettings(prev => ({ ...prev, fullName: e.target.value }))}
                      className="h-12 border-2 rounded-lg text-base bg-background/50 backdrop-blur-sm border-[var(--mauve)]/20 focus:border-[var(--mauve)] focus:ring-2 focus:ring-[var(--mauve)]/20 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium text-foreground text-center block">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={personalSettings.email}
                      onChange={(e) => setPersonalSettings(prev => ({ ...prev, email: e.target.value }))}
                      className="h-12 border-2 rounded-lg text-base bg-background/50 backdrop-blur-sm border-[var(--blue)]/20 focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <Button 
                    onClick={handleSavePersonalSettings}
                    disabled={isSaving}
                    className="bg-[var(--mauve)] hover:bg-[var(--mauve)]/90 disabled:opacity-50"
                  >
                    <Save className="h-6 w-6 mr-3" />
                    {isSaving ? "Saving..." : "Save Personal Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoice">
            <Card className="border-l-4 border-l-[var(--blue)] shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="p-3 rounded-xl bg-[var(--blue)]/10 w-fit mx-auto mb-4">
                  <FileText className="h-8 w-8 text-[var(--blue)]" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Invoice Settings
                </CardTitle>
                <CardDescription className="text-lg">
                  Customize your default invoice preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="taxRate" className="text-base font-medium text-foreground text-center block">
                        Tax Rate (%)
                      </Label>
                      <Input
                        id="taxRate"
                        type="number"
                        placeholder="0"
                        value={invoiceSettings.taxRate}
                        onChange={(e) => setInvoiceSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                        className="h-12 border-2 rounded-lg text-base bg-background/50 backdrop-blur-sm border-[var(--yellow)]/20 focus:border-[var(--yellow)] focus:ring-2 focus:ring-[var(--yellow)]/20 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-base font-medium text-foreground text-center block">
                        Currency
                      </Label>
                      <Input
                        id="currency"
                        placeholder="USD"
                        value={invoiceSettings.currency}
                        onChange={(e) => setInvoiceSettings(prev => ({ ...prev, currency: e.target.value }))}
                        className="h-12 border-2 rounded-lg text-base bg-background/50 backdrop-blur-sm border-[var(--green)]/20 focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="invoicePrefix" className="text-base font-medium text-foreground text-center block">
                        Invoice Prefix
                      </Label>
                      <Input
                        id="invoicePrefix"
                        placeholder="INV"
                        value={invoiceSettings.invoicePrefix}
                        onChange={(e) => setInvoiceSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))}
                        className="h-12 border-2 rounded-lg text-base bg-background/50 backdrop-blur-sm border-[var(--mauve)]/20 focus:border-[var(--mauve)] focus:ring-2 focus:ring-[var(--mauve)]/20 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextNumber" className="text-base font-medium text-foreground text-center block">
                        Next Invoice Number
                      </Label>
                      <Input
                        id="nextNumber"
                        type="number"
                        placeholder="1"
                        value={invoiceSettings.nextInvoiceNumber}
                        onChange={(e) => setInvoiceSettings(prev => ({ ...prev, nextInvoiceNumber: parseInt(e.target.value) || 1 }))}
                        className="h-12 border-2 rounded-lg text-base bg-background/50 backdrop-blur-sm border-[var(--pink)]/20 focus:border-[var(--pink)] focus:ring-2 focus:ring-[var(--pink)]/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms" className="text-base font-medium text-foreground text-center block">
                      Default Payment Terms
                    </Label>
                    <Textarea
                      id="paymentTerms"
                      placeholder="e.g., Net 30 days, Due on receipt, etc."
                      value={invoiceSettings.paymentTerms}
                      onChange={(e) => setInvoiceSettings(prev => ({ ...prev, paymentTerms: e.target.value }))}
                      className="min-h-[120px] border-2 rounded-lg text-base bg-background/50 backdrop-blur-sm border-[var(--teal)]/20 focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <Button 
                    onClick={handleSaveInvoiceSettings}
                    disabled={isSavingInvoice}
                    className="bg-[var(--blue)] hover:bg-[var(--blue)]/90"
                  >
                    <Save className="h-6 w-6 mr-3" />
                    {isSavingInvoice ? "Saving..." : "Save Invoice Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card className="border-l-4 border-l-[var(--green)] shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="p-3 rounded-xl bg-[var(--green)]/10 w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-[var(--green)]" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Account & Security
                </CardTitle>
                <CardDescription className="text-lg">
                  Manage your account security and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium text-foreground text-center block">
                      Current Password
                    </Label>
                    <div className="relative max-w-md mx-auto">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your current password"
                        value={accountSettings.currentPassword}
                        onChange={(e) => setAccountSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="h-10 border-2 rounded-lg text-sm bg-background/50 backdrop-blur-sm border-[var(--red)]/20 focus:border-[var(--red)] focus:ring-2 focus:ring-[var(--red)]/20 transition-all duration-200 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-[var(--red)]/10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-sm font-medium text-foreground text-center block">
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter your new password"
                        value={accountSettings.newPassword}
                        onChange={(e) => setAccountSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="h-10 border-2 rounded-lg text-sm bg-background/50 backdrop-blur-sm border-[var(--green)]/20 focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--green)]/20 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground text-center block">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your new password"
                        value={accountSettings.confirmPassword}
                        onChange={(e) => setAccountSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="h-10 border-2 rounded-lg text-sm bg-background/50 backdrop-blur-sm border-[var(--blue)]/20 focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <Button 
                    onClick={handleSaveAccountSettings}
                    disabled={isSavingAccount}
                    className="bg-[var(--green)] hover:bg-[var(--green)]/90"
                  >
                    <Save className="h-6 w-6 mr-3" />
                    {isSavingAccount ? "Saving..." : "Save Account Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </ProtectedLayout>
  )
}