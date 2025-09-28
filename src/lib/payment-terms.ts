/**
 * Utility functions for handling payment terms with dynamic values
 */

/**
 * Calculate the number of days between two dates
 */
export function calculateDaysBetween(startDate: Date, endDate: Date): number {
  const timeDiff = endDate.getTime() - startDate.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * Replace placeholders in payment terms text with dynamic values
 * @param paymentTerms - The payment terms text with placeholders
 * @param issueDate - The invoice issue date
 * @param dueDate - The invoice due date
 * @returns The payment terms text with placeholders replaced
 */
export function processPaymentTerms(
  paymentTerms: string | null | undefined,
  issueDate: Date | string,
  dueDate: Date | string
): string {
  if (!paymentTerms) return ""
  
  // Convert dates to Date objects if they're strings
  const issue = typeof issueDate === 'string' ? new Date(issueDate) : issueDate
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  
  // Calculate days between issue and due date
  const days = calculateDaysBetween(issue, due)
  
  // Replace [X] placeholder with the calculated days
  return paymentTerms.replace(/\[X\]/g, days.toString())
}

/**
 * Get a preview of payment terms with sample dates (30 days from today)
 * @param paymentTerms - The payment terms text with placeholders
 * @returns The payment terms text with placeholders replaced using sample dates
 */
export function getPaymentTermsPreview(paymentTerms: string | null | undefined): string {
  if (!paymentTerms) return ""
  
  const today = new Date()
  const sampleDueDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from today
  
  return processPaymentTerms(paymentTerms, today, sampleDueDate)
}
