"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Mail, Phone, MapPin, Building2, Save, Plus } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

export default function NewClientPage() {
  const router = useRouter()
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
  })

  const onSubmit = async (data: ClientFormData) => {
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create client")
      }

      await response.json()
      
      toast.success("Client created successfully")
      router.push("/clients")
    } catch (error) {
      console.error("Error creating client:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create client")
    }
  }

  return (
    <ProtectedLayout>
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--green)]/8 via-[var(--blue)]/8 to-[var(--mauve)]/8"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InZhcig--bWF1dmUpIiBmaWxsLW9wYWNpdHk9IjAuMDgiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[var(--green)]/15 to-[var(--blue)]/15 rounded-3xl mb-8 group hover:scale-110 transition-all duration-500 shadow-lg shadow-[var(--green)]/10">
              <User className="h-12 w-12 text-[var(--green)] group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-light text-foreground mb-8 group">
              <span className="bg-gradient-to-r from-[var(--green)] via-[var(--blue)] to-[var(--mauve)] bg-clip-text text-transparent transition-all duration-700 drop-shadow-sm">
                New Client
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Add a new client to your system and start creating invoices
            </p>
            <div className="mt-8">
              <Button variant="ghost" size="sm" asChild className="hover:bg-gradient-to-r hover:from-[var(--green)]/10 hover:to-[var(--blue)]/10 transition-all duration-300 shadow-sm hover:shadow-md">
                <Link href="/clients">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Clients
                </Link>
              </Button>
            </div>
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
                  <User className="h-7 w-7 text-[var(--green)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Client Information</p>
                  <p className="text-2xl font-bold text-foreground">Required</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl hover:shadow-[var(--blue)]/10 transition-all duration-300 border-l-4 border-l-[var(--blue)] bg-gradient-to-br from-[var(--blue)]/5 to-transparent hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--blue)]/15 to-[var(--blue)]/5 shadow-lg shadow-[var(--blue)]/10">
                  <Mail className="h-7 w-7 text-[var(--blue)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Details</p>
                  <p className="text-2xl font-bold text-foreground">Email Required</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl hover:shadow-[var(--mauve)]/10 transition-all duration-300 border-l-4 border-l-[var(--mauve)] bg-gradient-to-br from-[var(--mauve)]/5 to-transparent hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--mauve)]/15 to-[var(--mauve)]/5 shadow-lg shadow-[var(--mauve)]/10">
                  <MapPin className="h-7 w-7 text-[var(--mauve)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-2xl font-bold text-foreground">Optional</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-l-4 border-l-[var(--green)] shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[var(--green)]/5 to-transparent">
          <CardHeader className="text-center pb-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--green)]/15 to-[var(--green)]/5 w-fit mx-auto mb-6 shadow-lg shadow-[var(--green)]/10">
              <Building2 className="h-10 w-10 text-[var(--green)]" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Client Information
            </CardTitle>
            <CardDescription className="text-xl">
              Enter the client's contact and address information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-base font-semibold text-foreground">
                          Name <span className="text-[var(--red)] font-bold">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Client name" 
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
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-base font-semibold text-foreground">
                          Email <span className="text-[var(--red)] font-bold">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="client@example.com" 
                            {...field}
                            className="h-14 border-2 border-border hover:border-[var(--blue)]/50 focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/20 transition-all duration-200 text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-[var(--red)]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-base font-semibold text-foreground">
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(555) 123-4567" 
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
                    name="country"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-base font-semibold text-foreground">
                          Country
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="United States" 
                            {...field}
                            className="h-14 border-2 border-border hover:border-[var(--peach)]/50 focus:border-[var(--peach)] focus:ring-2 focus:ring-[var(--peach)]/20 transition-all duration-200 text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-[var(--red)]" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-semibold text-foreground">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Street address" 
                          {...field}
                          className="min-h-[120px] border-2 border-border hover:border-[var(--sky)]/50 focus:border-[var(--sky)] focus:ring-2 focus:ring-[var(--sky)]/20 transition-all duration-200 text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-[var(--red)]" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-base font-semibold text-foreground">
                          City
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="City" 
                            {...field}
                            className="h-14 border-2 border-border hover:border-[var(--pink)]/50 focus:border-[var(--pink)] focus:ring-2 focus:ring-[var(--pink)]/20 transition-all duration-200 text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-[var(--red)]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-base font-semibold text-foreground">
                          State
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="XX" 
                            {...field}
                            className="h-14 border-2 border-border hover:border-[var(--yellow)]/50 focus:border-[var(--yellow)] focus:ring-2 focus:ring-[var(--yellow)]/20 transition-all duration-200 text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-[var(--red)]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-base font-semibold text-foreground">
                          ZIP Code
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ZIP Code" 
                            {...field}
                            className="h-14 border-2 border-border hover:border-[var(--teal)]/50 focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20 transition-all duration-200 text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-[var(--red)]" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-center pt-12 border-t-2 border-border/50">
                  <div className="flex space-x-6">
                    <Button type="button" variant="outline" asChild className="h-12 px-8 border-2 border-border hover:border-[var(--mauve)]/50 hover:text-[var(--mauve)] transition-all duration-300 shadow-sm hover:shadow-md">
                      <Link href="/clients">Cancel</Link>
                    </Button>
                    <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-[var(--green)] to-[var(--green)]/90 hover:from-[var(--green)]/90 hover:to-[var(--green)]/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                      <Plus className="h-5 w-5 mr-2" />
                      Create Client
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </ProtectedLayout>
  )
}
