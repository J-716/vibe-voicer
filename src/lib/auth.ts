import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "./db"
import { sendEmail, getVerificationEmailTemplate, getPasswordResetEmailTemplate } from "./email"

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.RESEND_API_KEY && process.env.SMTP_FROM ? true : false, // Only require verification if both Resend and SMTP_FROM are configured
    sendResetPassword: async ({ user, url, token }, request) => {
      const template = getPasswordResetEmailTemplate(url, user)
      await sendEmail({
        to: user.email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      })
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const template = getVerificationEmailTemplate(url, user)
      await sendEmail({
        to: user.email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      })
    },
  },
  socialProviders: {
    google: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    } : undefined,
    github: process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    } : undefined,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  user: {
    additionalFields: {
      name: {
        type: "string",
        required: false,
      },
      image: {
        type: "string",
        required: false,
      },
    },
  },
  baseURL: process.env.BETTER_AUTH_URL || (process.env.NODE_ENV === "production" ? "https://www.j-designs.org" : "http://localhost:3000"),
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-here",
  trustedOrigins: [
    "http://localhost:3000",
    "https://localhost:3000",
    "https://www.j-designs.org",
    "https://j-designs.org",
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
    ...(process.env.TRUSTED_ORIGINS ? process.env.TRUSTED_ORIGINS.split(',') : []),
    ...(process.env.NODE_ENV === "production" ? [process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""] : [])
  ].filter(Boolean),
  ...(process.env.NODE_ENV === "development" ? { trustHost: true } : {}),
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user