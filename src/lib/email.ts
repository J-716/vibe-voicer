import { Resend } from 'resend'

interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
}

// Initialize Resend (only if API key is available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  try {
    if (!resend) {
      console.error('RESEND_API_KEY is not configured')
      throw new Error('Email service not configured. Please contact support.')
    }

    const { data, error } = await resend.emails.send({
      from: process.env.SMTP_FROM || 'onboarding@resend.dev',
      to: [to],
      subject,
      text,
      html: html || text,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error(`Email service error: ${error.message}`)
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Email sent via Resend:', data?.id)
    }

    return { success: true, messageId: data?.id, provider: 'resend' }
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Email templates
export const getVerificationEmailTemplate = (url: string, user: { name?: string; email: string }) => {
  const name = user.name || 'User'
  
  return {
    subject: 'Verify your email address - VibeVoicer',
    text: `Hello ${name},\n\nPlease verify your email address by clicking the link below:\n\n${url}\n\nIf you didn't create an account with VibeVoicer, you can safely ignore this email.\n\nBest regards,\nThe VibeVoicer Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify your email address</h2>
        <p>Hello ${name},</p>
        <p>Thank you for signing up with VibeVoicer! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email Address</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${url}</p>
        <p>If you didn't create an account with VibeVoicer, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">Best regards,<br>The VibeVoicer Team</p>
      </div>
    `
  }
}

export const getPasswordResetEmailTemplate = (url: string, user: { name?: string; email: string }) => {
  const name = user.name || 'User'
  
  return {
    subject: 'Reset your password - VibeVoicer',
    text: `Hello ${name},\n\nYou requested to reset your password. Click the link below to reset it:\n\n${url}\n\nThis link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.\n\nBest regards,\nThe VibeVoicer Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset your password</h2>
        <p>Hello ${name},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${url}</p>
        <p style="color: #dc3545; font-weight: bold;">This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">Best regards,<br>The VibeVoicer Team</p>
      </div>
    `
  }
}
