"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeSelector } from "@/components/theme-selector"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function PublicNavigation() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--blue)]/10 to-[var(--mauve)]/10 group-hover:from-[var(--blue)]/20 group-hover:to-[var(--mauve)]/20 transition-all duration-300">
              <Image 
                src="/images/vibevoicermain.png" 
                alt="Vibe Voicer" 
                width={24} 
                height={24} 
                className="logo-text-color"
              />
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground group-hover:text-[var(--blue)] transition-colors duration-300">
                Vibe Voicer
              </span>
              <p className="text-xs text-muted-foreground -mt-1">Invoice Management</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                Features
              </Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                Pricing
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                About
              </Link>
            </nav>
            
            <div className="flex items-center space-x-3">
              <ThemeSelector />
              <div className="hidden sm:block w-px h-6 bg-border"></div>
              <Button asChild variant="outline" className="h-12 px-6 border-2 border-border hover:border-[var(--mauve)]/50 hover:text-[var(--mauve)] hover:bg-gradient-to-r hover:from-[var(--mauve)]/10 hover:to-[var(--mauve)]/5 transition-all duration-300 shadow-sm hover:shadow-md">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="h-12 px-6 bg-gradient-to-r from-[var(--blue)] to-[var(--blue)]/90 hover:from-[var(--blue)]/90 hover:to-[var(--blue)]/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                <Link href="/register" className="flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
