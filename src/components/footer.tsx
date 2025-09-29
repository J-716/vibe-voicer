"use client"

import Link from "next/link"
import { FileText } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--blue)]/10 to-[var(--mauve)]/10 group-hover:from-[var(--blue)]/20 group-hover:to-[var(--mauve)]/20 transition-all duration-300">
            <FileText className="h-6 w-6 text-[var(--blue)]" />
          </div>
          <div>
            <span className="text-2xl font-bold text-foreground group-hover:text-[var(--blue)] transition-colors duration-300">
              Vibe Voicer
            </span>
            <p className="text-xs text-muted-foreground -mt-1">Invoice Management</p>
          </div>
        </Link>
        <p className="text-muted-foreground text-sm">
          &copy; {currentYear} Vibe Voicer. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
