"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      richColors={true}
      closeButton={true}
      expand={true}
      duration={4000}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-md group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:p-4",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:opacity-90 group-[.toast]:mt-1",
          actionButton: "group-[.toast]:bg-[var(--blue)] group-[.toast]:hover:bg-[var(--blue)]/90 group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:rounded-lg group-[.toast]:transition-all group-[.toast]:duration-200 group-[.toast]:shadow-sm group-[.toast]:hover:shadow-md",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:hover:bg-muted/80 group-[.toast]:text-muted-foreground group-[.toast]:font-medium group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:rounded-lg group-[.toast]:transition-all group-[.toast]:duration-200 group-[.toast]:border group-[.toast]:border-border",
          closeButton: "group-[.toast]:opacity-70 group-[.toast]:hover:opacity-100 group-[.toast]:transition-opacity group-[.toast]:hover:bg-muted/50 group-[.toast]:rounded-md group-[.toast]:p-1",
          title: "group-[.toast]:text-foreground group-[.toast]:font-semibold group-[.toast]:text-base group-[.toast]:mb-1",
          success: "group-[.toast]:border-l-4 group-[.toast]:border-l-[var(--green)] group-[.toast]:bg-[var(--green)]/5",
          error: "group-[.toast]:border-l-4 group-[.toast]:border-l-[var(--red)] group-[.toast]:bg-[var(--red)]/5",
          warning: "group-[.toast]:border-l-4 group-[.toast]:border-l-[var(--yellow)] group-[.toast]:bg-[var(--yellow)]/5",
          info: "group-[.toast]:border-l-4 group-[.toast]:border-l-[var(--sky)] group-[.toast]:bg-[var(--sky)]/5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
