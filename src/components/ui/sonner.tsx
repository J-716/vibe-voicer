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
        style: {
          background: 'hsl(0, 0%, 100%)',
          color: 'hsl(0, 0%, 9%)',
          border: '1px solid hsl(0, 0%, 90%)',
        },
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-gray-600 group-[.toast]:text-sm group-[.toast]:opacity-90",
          actionButton: "group-[.toast]:bg-gray-100 group-[.toast]:hover:bg-gray-200 group-[.toast]:text-gray-900 group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-md group-[.toast]:transition-colors",
          cancelButton: "group-[.toast]:bg-gray-50 group-[.toast]:hover:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-md group-[.toast]:transition-colors",
          closeButton: "group-[.toast]:opacity-70 group-[.toast]:hover:opacity-100 group-[.toast]:transition-opacity",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
