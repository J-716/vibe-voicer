import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency with proper locale formatting
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | string,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numericAmount)) {
    return '$0.00'
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount)
}

/**
 * Format a number as a quantity (whole number without decimals)
 * @param quantity - The quantity to format
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted quantity string
 */
export function formatQuantity(
  quantity: number | string,
  locale: string = 'en-US'
): string {
  const numericQuantity = typeof quantity === 'string' ? parseFloat(quantity) : quantity
  
  if (isNaN(numericQuantity)) {
    return '0'
  }
  
  // Round to nearest whole number
  const roundedQuantity = Math.round(numericQuantity)
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedQuantity)
}
